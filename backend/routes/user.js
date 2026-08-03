const express = require('express')
const z = require('zod')
const bcrypt = require('bcrypt')
const { User, Account } = require('../db')
const jwt = require('jsonwebtoken')
const authMiddleware = require('./middleware')
const router = express.Router()

// Step.1 - Define Zod Security
const signupSchema = z.object({
    username: z.string().min(3, { message: "Usename must be at least 3 characters long" })
        .max(12, { message: "Usename must be less than 12 characters long" }).toLowerCase(),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" })
        .max(20, { message: "Password must be less than 20 characters long" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/[0-9]/, { message: "Password must contain at least one number" })
        .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character" }),
    firstname: z.string().max(30, { message: "Password must be less than 30 characters long" }),
    lastname: z.string().max(30, { message: "Password must be less than 30 characters long" }),
})

// Step.2 - Define body Structure for Post '/signup' Route
router.post('/signup', async (req, res) => {
    const body = req.body;
    const { success } = signupSchema.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: 'Incorrect inputs'
        })
    }
    // Step.3 - Find Username in Database 
    const existingUser = await User.findOne({
        username: body.username
    })

    if (existingUser) {
        return res.status(411).json({
            message: 'Username already taken/ Incorrect inputs'
        })
    }

    // Step 4 - HASH THE PASSWORD (Signup ka main logic)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(body.password, saltRounds);

    // Step 5 - Create New User in Database (with Hashed Password)
    const dbUser = await User.create({
        username: body.username,
        password: hashedPassword // Plain password ki jagah hashed wala save kar rahe hain
    });
    const userId = dbUser._id

    // Random Amount give to the New Account Created
    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    })

    // Step 6 - Generate JWT Token
    // (Yahan compare check ki zaroorat nahi hai, user successfully ban chuka hai)
    const token = jwt.sign({
        userId
    }, process.env.JWT_SECRET);

    // Step 7 - Send Response
    return res.status(200).json({
        message: "Username created successfully",
        token: token
    });
})


const signinSchema = z.object({
    username: z.string().min(3, { message: "Usename must be at least 3 characters long" })
        .max(12, { message: "Usename must be less than 12 characters long" }).toLowerCase(),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" })
        .max(20, { message: "Password must be less than 20 characters long" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/[0-9]/, { message: "Password must contain at least one number" })
        .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character" }),
})


router.post('/signin', async (req, res) => {
    const body = req.body;
    const { success } = signinSchema.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: 'Username/Password Invalid'
        })
    }
    // Step.3 - Find Username in Database 
    const existingUser = await User.findOne({
        username: body.username,
    })
    if (!existingUser._id) {
        return res.status(411).json({
            message: 'User not found or Invalid credentials'
        })
    }

    const isPasswordValid = await bcrypt.compare(body.existingUser, existingUser.password)

    if (isPasswordValid) {
        const token = jwt.sign({
            userId: existingUser._id
        }, process.env.JWT_SECRET)
        return res.status(200).json({
            message: "Account Logedin Successfully",
            token: token
        })
    }
    res.status(411).json({
        message: "Error while LoggingIn / Wrong Password"
    })
})

const updateBody = z.object({
    password: z.string().min(8, { message: "Password must be at least 8 characters long" })
        .max(20, { message: "Password must be less than 20 characters long" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/[0-9]/, { message: "Password must contain at least one number" })
        .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character" }),
    firstname: z.string().max(30, { message: "Password must be less than 30 characters long" }),
    lastname: z.string().max(30, { message: "Password must be less than 30 characters long" }),
})

router.post('/', authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }
    await User.updateOne({ _id: req.userId }, req.body)
    res.json({
        message: 'Updated Successfully'
    })
})

router.get('/bulk', async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstname: {
                "$regex": filter
            }
        }, {
            lastname: {
                "$regrex": filter
            }
        }]
    })

    res.json({
        user: users.map({
            username: user.username,
            firstname: user.firstName,
            lastname: user.lastname,
            _id: user._id
        })
    })
})

module.exports = router

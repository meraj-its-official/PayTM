const express = require('express')
const z = require('zod')
const { User } = require('../db')
const jwt = require('jsonwebtoken')
const JWT_SECRET = require('./config')
const router = express.Router()

// Step.1 - Define Zod Security
const signupSchema = z.object({
    username: z.string().min(3, { message: "Usename must be at least 3 characters long" })
        .max(18, { message: "Usename must be less than 18 characters long" }).toLowerCase(),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/[0-7]/, { message: "Password must contain at least one number" })
        .regex(/[^a-zA-Z0-7]/, { message: "Password must contain at least one special character" }),
    firstName: z.string(),
    secondName: z.string(),
})

// Step.2 - Define body Structure for Post '/signup' Route
router.post('/signup', async (res, req) => {
    const body = req.body;
    const { success } = signupSchema.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: 'Username already taken/ Incorrect inputs'
        })
    }
    // Step.3 - Find Username in Database 
    const existingUser = await User.findOne({
        username: body.username
    })

    if (existingUser._id) {
        return res.status(411).json({
            message: 'Username already taken/ Incorrect inputs'
        })
    }

    // Step.4 - Create New Username in Database
    const dbUser = await User.create(body);

    // Step.5 - Set JWT Authentication
    const token = jwt.sign({
        userId: dbUser._id
    }, JWT_SECRET)

    // Step.6 - Set token to Cross Checks for Successful Username Created 
    res.json({
        message: "Username created successfully",
        token: token
    })
})

router.post('/signin', (res, req) => {
    const body = req.body;
    const { success } = signupSchema.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: 'Username/Password Invalid'
        })
    }
    // Step.3 - Find Username in Database 
    const existingUser = await User.findOne({
        username: body.username
    })

    if (existingUser) {
        const token = jwt.sign({
            userId: existingUser._id
        }, JWT_SECRET)
        return res.status(200).json({
            message: "Account Logedin Successfully",
            token: token
        })
    }
})

module.export = router;
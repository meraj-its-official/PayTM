const express = require('express');
const { authMiddleware } = require('./middleware');
const { Account } = require('../db');
const { default: mongoose } = require('mongoose');
const router = express.Router();

router.get('/balance', authMiddleware, async (req, res) => {
    const account = await Account.findOne({
        userId: req.userId
    })
    res.json({
        balance: account.balance
    })
})

try {
    router.post('/transfar', authMiddleware, async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();

        const { amount, to } = req.body

        // Fetch the accounts while Transaction
        const account = await Account.findOne({ userId: req.body }).session(session)

        if (!account || account.balance < amount) {
            await session.abortTransaction()
            return res.status(400).json({
                message: "Insuficent Balance"
            })
        }

        const toaccount = await Account.findOne({ userId: to }).session(session)

        if (!toaccount) {
            await session.abortTransaction()
            return res.status(400).json({
                message: 'Invalid Account'
            })
        }

        // Perform the Transaction

        await Account.updateOne({ userId: req.userId }, { $inc: { balance: - amount } }).session(session)
        await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session)

        // Commit the Transaction 

        await session.commitTransaction();

        res.json({
            message: "Transfar Successful"
        })
    })
} catch (error) {
    return res.status(504).json({
        message: "Sorry ! Someting is Wrong in Interal Server"
    })
}

module.exports = {
    router
}
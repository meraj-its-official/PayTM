// db.js
const mongoose = require('mongoose');
const { maxLength, minLength } = require('zod');

// Yahan process.env.MONGO_URI (ya jo bhi variable naam tumne .env mein rakha hai) use hoga
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Database Connected Successfully!"))
    .catch((err) => console.log("❌ Database Error: ", err));

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, minLength: 3, maxLength: 12 },
    password: { type: String, required: true, minLength: 8, maxLength: 20 },
    firstname: { type: String, required: true, maxLength: 30 },
    lastname: { type: String, required: true, maxLength: 30 },
});

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Refrence to the User Model
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
});

// Is model ko export kar rahe hain taaki data push kar sakein
const User = mongoose.model('User', userSchema)
const Account = mongoose.model('Account', accountSchema)
module.exports = {
    User,
    Account
}
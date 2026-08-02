// db.js
const mongoose = require('mongoose');
const { maxLength, minLength } = require('zod');
require('dotenv').config(); // Ye line .env file se data utha kar process.env mein daalti hai

const connectDB = async () => {
    try {
        // Yahan process.env.MONGO_URI (ya jo bhi variable naam tumne .env mein rakha hai) use hoga
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected Successfully! 🚀");
    } catch (error) {
        console.error("MongoDB Connection Failed ❌", error);
        process.exit(1); // Agar connection fail ho jaye toh app crash/stop kar do
    }
};

const paytmSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, minLength: 3, maxLength: 15 },
    password: { type: String, required: true, minLength: 8, maxLength: 18 },
    firstName: { type: String, required: true, maxLength: 50 },
    secondName: { type: String, required: true, maxLength: 50 },
});

// Is model ko export kar rahe hain taaki data push kar sakein
module.exports = mongoose.model('User', paytmSchema);
module.exports = connectDB;
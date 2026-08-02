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

const paytmSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true, minLength: 3, maxLength: 18 },
    password: { type: String, required: true, minLength: 8 },
    firstName: { type: String, required: true },
    secondName: { type: String, required: true },
});

// Is model ko export kar rahe hain taaki data push kar sakein
const User = mongoose.model('User', paytmSchema);
module.exports = {
    User
}
// module.exports = connectDB;
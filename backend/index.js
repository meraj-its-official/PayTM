require('dotenv').config(); // Ye line .env file se data utha kar process.env mein daalti hai
const express = require('express')
const cors = require('cors')
app.use(express.json())
app.use(cors())
const mainRouter = require('./routes/index.js')

const app = express();
// 2. Data Push (Save) Karne Ka Route
app.post('/api/v1', mainRouter)

// global catch 
let errorCount = 0;
app.use((err, req, res, next) => {
    errorCount++;
    res.status(500).send("Sorry ! Invalid Cridentals");
})

app.listen(PORT, () => { });
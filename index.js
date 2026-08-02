// server.js
const express = require('express')
const mainRouter = require('./routes/index.js')
const cors = require('cors')
app.use(express.json())
app.use(cors())
// connectDB();

const app = express();
// 2. Data Push (Save) Karne Ka Route
app.post('/api/v1', mainRouter)

// global catch 
let errorCount = 0;
app.use((err, req, res, next) => {
    errorCount++;
    console.log("Error: " + errorCount);
    res.status(500).send("Sorry ! Invalid Cridentals");
})

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
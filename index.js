// server.js
const express = require('express')
const mainRouter = require('./routes/index.js')
const cors = require('cors')
app.use(express.json())
app.use(cors())
connectDB();

const app = express();
// 2. Data Push (Save) Karne Ka Route
app.post('/api/v1', mainRouter)

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
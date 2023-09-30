require('dotenv').config()
const express = require('express')
const blogRoute = require('./routes/route')

const app = express()
const PORT = process.env.PORT || 4400

// middlewares
app.use(express.json())

// test route
app.get('/', (req, res) => {
    res.json('API is working...')
})
// routes
app.use("/api", blogRoute)

// start server
app.listen(PORT, () => { console.log("Sever Started"); })
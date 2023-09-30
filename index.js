require('dotenv').config()
const express = require('express')
const blogRoute = require('./routes/route')

const app = express()
const PORT = process.env.PORT || 4400

// middlewares
app.use(express.json())

// routes
app.use("/api", blogRoute)

// start server
app.listen(PORT, () => { console.log("Sever Started"); })
const express = require("express");
const app = express()
const Router = require("../Backend/Routers/Airtaxy.Router")
require("dotenv").config()
const cors = require("cors")
const {errorHandler} = require("./Middleware/ErrorHandler")

app.use(cors())

app.use(express.urlencoded({ extended: true, limit: '200mb' }))
app.use(express.json())
app.use('/airtaxy', Router)

app.use((request, response, next) => {
    response.status(404).send({ message: "Route not found" })
    next()
})


app.use(errorHandler)

const PORT = process.env.PORT
const URI = process.env.MONGO_URI
const mongoose = require("mongoose");
// const { errorHandler } = require("./Middleware/ErrorHandler");
mongoose.connect(URI).then(() => {
    console.log("mongoose connected successfully");
}).catch((error) => {
    console.log("mongoose disconnected", error)
})

app.listen(PORT, () => {
    console.log("app is running at " + PORT);
})
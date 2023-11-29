const express = require("express");
const Router = express.Router()
const { RegisterUser,SignedUser, forgotPassword, verifyPassword, resetPassword, imageUpload, images, hotelUpload, hotels, bookflight, getHomepage, TokenVerification, Summary, location } = require("../Controllers/Airtaxy.Controller");
const { AirtaxyValidator } = require("../Middleware/AirtaxyValidate");
const { validate } = require("../Middleware/AirtaxyValidator");

Router.post("/signup", validate(AirtaxyValidator), RegisterUser)
Router.post("/signin",validate(AirtaxyValidator),SignedUser)
Router.get("/homepage", getHomepage)
Router.post("/forget",forgotPassword)
Router.post("/verify",verifyPassword)
Router.post("/reset",resetPassword)
Router.post("/admin", imageUpload)
Router.get("/admin/getimage", images, hotels)
Router.post("/admin/hotel", hotelUpload)
Router.get("/admin/hotelimage", hotels)
Router.post("/bookflight", bookflight)
Router.get("/token", TokenVerification)
Router.get("/details", Summary)
// Router.post("/location",location)

module.exports = Router
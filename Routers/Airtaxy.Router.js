const express = require("express");
const Router = express.Router()
const { RegisterUser,SignedUser, forgotPassword, verifyPassword, resetPassword, imageUpload, images, hotelUpload, hotels, bookflight, getHomepage, TokenVerification, Summary, location, flightdelete, seatnumber, getflight, personalInfo, getuser } = require("../Controllers/Airtaxy.Controller");
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
Router.post("/deleteflight", flightdelete)
Router.post("/seatnumber",seatnumber)
Router.get("/getflight",getflight)
Router.get("/getuser",getuser)
Router.post("/personalinformation",personalInfo)

module.exports = Router
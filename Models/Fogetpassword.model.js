const mongoose = require("mongoose");

const forgotPasswordSchema = new mongoose.Schema({
    email: { type: String, required: true, trim: true, unique:true },
    OTP: { type: String, required: true, trim: true,}
})

const forgotPasswordModel = mongoose.models.forgotpassword_tbs || mongoose.model("forgotpassword_tbs", forgotPasswordSchema)
module.exports = {forgotPasswordModel}
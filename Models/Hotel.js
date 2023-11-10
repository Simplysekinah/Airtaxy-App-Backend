const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
    imageUrl: { type: String, required: true, trim: true },
    public_id: { type: String, required: true, trim: true },
    hotels:{type:String, required: true,trim: true}
})

const hotelModel = mongoose.models.hotel_tbs || mongoose.model("hotel_tbs", hotelSchema)

module.exports = {hotelModel}
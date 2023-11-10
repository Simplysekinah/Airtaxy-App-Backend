const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema({
    imageUrl: { type: String, required: true, trim: true },
    public_id: { type: String, required: true, trim: true },
    location:{type:String, required: true,trim: true},
    seat: {type:String,required: true,trim: true},
    price: {type:String,required: true,trim: true},
    business: {type:Array, required: true},
    seate: {type:String,required: true,trim: true},
    pricep: {type:String,required: true,trim: true},
    economy: {type:Array, required: true},
    seatf: {type:String,required: true,trim: true},
    pricef: {type:String,required: true,trim: true},
    first: {type:Array, required: true}
})

const destinationModel = mongoose.models.destination_tbs || mongoose.model("destination_tbs", destinationSchema)

module.exports = {destinationModel}
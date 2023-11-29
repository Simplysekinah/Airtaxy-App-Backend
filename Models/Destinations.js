const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema({
    imageUrl: { type: String, required: true, trim: true },
    public_id: { type: String, required: true, trim: true },
    to:{type:String, required: true,trim: true},
    from:{type:String, required: true,trim: true},
    seat: {type:String,required: true,trim: true},
    price: {type:String,required: true,trim: true},
    classes:[{
        type: {seat:{type:Number}, 
            price:{type:Number}, 
            class:{type:String}},
    }],

    // seate: {type:String,required: true,trim: true},
    // pricep: {type:String,required: true,trim: true},
    // seatf: {type:String,required: true,trim: true},
    // pricef: {type:String,required: true,trim: true},
})

const destinationModel = mongoose.models.destination_tbs || mongoose.model("destination_tbs", destinationSchema)

module.exports = destinationModel
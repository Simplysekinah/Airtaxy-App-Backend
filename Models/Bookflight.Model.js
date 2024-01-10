const mongoose = require("mongoose");

const BookflightSchema = new mongoose.Schema({
    from: { type: String, required: true, trim: true },
    to: { type: String, required: true, trim: true },
    dates: { type: String, required: true, trim: true },
    passenger: { type: String, required: true, trim: true },
    classes: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    seatNumber:{
        number:{type: String, trim: true },
        status:{ type: String, default: 'available'}
    }
})

const BookflightModel = mongoose.models.Bookflight_tbs || mongoose.model("Bookflight_tbs", BookflightSchema)

module.exports = {BookflightModel}
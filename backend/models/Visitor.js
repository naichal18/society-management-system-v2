const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    unit: { type: String, required: true },
    type: { type: String },
    timeIn: { type: String },
    timeOut: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Visitor', visitorSchema);

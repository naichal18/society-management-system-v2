const mongoose = require('mongoose');

const residentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    flat: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
    vehicles: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Resident', residentSchema);

const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: String },
    time: { type: String },
    venue: { type: String },
    agenda: { type: String },
    notes: { type: String },
    status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled'], default: 'Scheduled' }
}, { timestamps: true });

module.exports = mongoose.model('Meeting', meetingSchema);

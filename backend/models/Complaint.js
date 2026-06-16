const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    by: { type: String, required: true },
    unit: { type: String, required: true },
    category: { type: String },
    status: { type: String, enum: ['Open', 'In Progress', 'Closed'], default: 'Open' },
    details: { type: String },
    createdAt: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);

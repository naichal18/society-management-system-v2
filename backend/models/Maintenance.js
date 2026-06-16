const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    unit: { type: String, required: true },
    status: { type: String, enum: ['Open', 'In Progress', 'Closed'], default: 'Open' },
    details: { type: String },
    createdAt: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Maintenance', maintenanceSchema);

const mongoose = require('mongoose');

const gateKeeperSchema = new mongoose.Schema({
    name: { type: String, required: true },
    shift: { type: String, enum: ['Day', 'Night', 'Relief'], default: 'Day' },
    phone: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('GateKeeper', gateKeeperSchema);

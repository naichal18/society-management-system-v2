const mongoose = require('mongoose');

const helpContactSchema = new mongoose.Schema({
    role: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    description: { type: String, default: '' },
    category: { type: String, default: 'General' }
}, { timestamps: true });

module.exports = mongoose.model('HelpContact', helpContactSchema);

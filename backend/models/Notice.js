const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    body: { type: String },
    createdAt: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Notice', noticeSchema);

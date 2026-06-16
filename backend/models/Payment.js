const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    billId: { type: String, required: true, unique: true },
    residentId: { type: String },
    payer: { type: String, required: true },
    unit: { type: String, required: true },
    amount: { type: Number, default: 0 },
    billType: { type: String, default: 'Maintenance' },
    chargesBreakdown: {
        maintenance: { type: Number, default: 0 },
        water: { type: Number, default: 0 },
        electricity: { type: Number, default: 0 },
        parking: { type: Number, default: 0 },
        lift: { type: Number, default: 0 },
        security: { type: Number, default: 0 },
        other: { type: Number, default: 0 }
    },
    dueDate: { type: String },
    status: { type: String, enum: ['Paid', 'Unpaid', 'Overdue', 'Pending'], default: 'Unpaid' },
    paidDate: { type: String },
    notes: { type: String, default: '' },
    period: { type: String },
    date: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);

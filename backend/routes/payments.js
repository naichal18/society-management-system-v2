const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const { protect, admin } = require('../middleware/auth');

router.route('/')
    .get(protect, async (req, res) => {
        try {
            const payments = await Payment.find({});
            res.json(payments);
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    })
    .post(protect, admin, async (req, res) => {
        try {
            if (!req.body.billId) {
                const count = await Payment.countDocuments({});
                req.body.billId = `BILL-${100 + count + 1}`;
            }
            const payment = await Payment.create(req.body);
            res.status(201).json(payment);
        } catch (error) {
            res.status(500).json({ message: 'Server Error: ' + error.message });
        }
    });

router.route('/:id')
    .put(protect, async (req, res) => {
        try {
            const payment = await Payment.findById(req.params.id);
            if (!payment) return res.status(404).json({ message: 'Bill not found' });
            
            if (req.user.role === 'admin') {
                Object.assign(payment, req.body);
                await payment.save();
                res.json(payment);
            } else {
                // Check if this bill belongs to the resident
                // To be safe, we check if payment.unit equals the user's flat OR if payment.residentId matches the user's ID
                const userFlat = req.user.flat;
                const isOwnBill = payment.unit === userFlat || payment.residentId === req.user.id || (userFlat && payment.unit && payment.unit.toLowerCase() === userFlat.toLowerCase());
                if (!isOwnBill) {
                    return res.status(403).json({ message: 'Not authorized to pay this bill' });
                }
                
                // Resident can pay or mark payment as complete
                payment.status = req.body.status || 'Paid';
                payment.paidDate = req.body.paidDate || new Date().toISOString().slice(0, 10);
                payment.date = payment.paidDate; // backward compatibility
                await payment.save();
                res.json(payment);
            }
        } catch (error) {
            res.status(500).json({ message: 'Server Error: ' + error.message });
        }
    })
    .delete(protect, admin, async (req, res) => {
        try {
            await Payment.findByIdAndDelete(req.params.id);
            res.json({ message: 'Payment removed' });
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    });

module.exports = router;

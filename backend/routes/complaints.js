const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const { protect, admin } = require('../middleware/auth');

router.route('/')
    .get(protect, async (req, res) => {
        try {
            const complaints = await Complaint.find({});
            res.json(complaints);
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    })
    .post(protect, async (req, res) => {
        try {
            const complaint = await Complaint.create(req.body);
            res.status(201).json(complaint);
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    });

router.route('/:id')
    .put(protect, async (req, res) => {
        try {
            // Admin can edit fully. Residents can maybe update status or edit their own, but let's keep it simple.
            const complaint = await Complaint.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.json(complaint);
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    })
    .delete(protect, admin, async (req, res) => {
        try {
            await Complaint.findByIdAndDelete(req.params.id);
            res.json({ message: 'Complaint removed' });
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    });

module.exports = router;

const express = require('express');
const router = express.Router();
const Meeting = require('../models/Meeting');
const { protect, admin } = require('../middleware/auth');

router.route('/')
    .get(protect, async (req, res) => {
        try {
            const meetings = await Meeting.find({});
            res.json(meetings);
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    })
    .post(protect, admin, async (req, res) => {
        try {
            const meeting = await Meeting.create(req.body);
            res.status(201).json(meeting);
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    });

router.route('/:id')
    .put(protect, admin, async (req, res) => {
        try {
            const meeting = await Meeting.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.json(meeting);
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    })
    .delete(protect, admin, async (req, res) => {
        try {
            await Meeting.findByIdAndDelete(req.params.id);
            res.json({ message: 'Meeting removed' });
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    });

module.exports = router;

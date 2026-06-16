const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice');
const { protect, admin } = require('../middleware/auth');

router.route('/')
    .get(protect, async (req, res) => {
        try {
            const notices = await Notice.find({});
            res.json(notices);
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    })
    .post(protect, admin, async (req, res) => {
        try {
            const notice = await Notice.create(req.body);
            res.status(201).json(notice);
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    });

router.route('/:id')
    .put(protect, admin, async (req, res) => {
        try {
            const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.json(notice);
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    })
    .delete(protect, admin, async (req, res) => {
        try {
            await Notice.findByIdAndDelete(req.params.id);
            res.json({ message: 'Notice removed' });
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    });

module.exports = router;

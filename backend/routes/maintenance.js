const express = require('express');
const router = express.Router();
const Maintenance = require('../models/Maintenance');
const { protect, admin } = require('../middleware/auth');

router.route('/')
    .get(protect, async (req, res) => {
        try {
            const maintenance = await Maintenance.find({});
            res.json(maintenance);
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    })
    .post(protect, async (req, res) => {
        try {
            const maintenance = await Maintenance.create(req.body);
            res.status(201).json(maintenance);
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    });

router.route('/:id')
    .put(protect, async (req, res) => {
        try {
            const maintenance = await Maintenance.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.json(maintenance);
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    })
    .delete(protect, admin, async (req, res) => {
        try {
            await Maintenance.findByIdAndDelete(req.params.id);
            res.json({ message: 'Maintenance removed' });
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    });

module.exports = router;

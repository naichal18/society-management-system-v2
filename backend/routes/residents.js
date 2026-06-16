const express = require('express');
const router = express.Router();
const Resident = require('../models/Resident');
const { protect, admin } = require('../middleware/auth');

router.route('/')
    .get(protect, async (req, res) => {
        try {
            const residents = await Resident.find({});
            res.json(residents);
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    })
    .post(protect, admin, async (req, res) => {
        try {
            const resident = await Resident.create(req.body);
            res.status(201).json(resident);
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    });

router.route('/:id')
    .put(protect, admin, async (req, res) => {
        try {
            const resident = await Resident.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (resident) {
                res.json(resident);
            } else {
                res.status(404).json({ message: 'Resident not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    })
    .delete(protect, admin, async (req, res) => {
        try {
            const resident = await Resident.findByIdAndDelete(req.params.id);
            if (resident) {
                res.json({ message: 'Resident removed' });
            } else {
                res.status(404).json({ message: 'Resident not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    });

module.exports = router;

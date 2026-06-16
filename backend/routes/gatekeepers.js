const express = require('express');
const router = express.Router();
const GateKeeper = require('../models/GateKeeper');
const { protect, admin } = require('../middleware/auth');

router.route('/')
    .get(protect, async (req, res) => {
        try {
            const gateKeepers = await GateKeeper.find({});
            res.json(gateKeepers);
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    })
    .post(protect, admin, async (req, res) => {
        try {
            const gateKeeper = await GateKeeper.create(req.body);
            res.status(201).json(gateKeeper);
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    });

router.route('/:id')
    .put(protect, admin, async (req, res) => {
        try {
            const gateKeeper = await GateKeeper.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.json(gateKeeper);
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    })
    .delete(protect, admin, async (req, res) => {
        try {
            await GateKeeper.findByIdAndDelete(req.params.id);
            res.json({ message: 'GateKeeper removed' });
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    });

module.exports = router;

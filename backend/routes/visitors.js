const express = require('express');
const router = express.Router();
const Visitor = require('../models/Visitor');
const { protect, admin } = require('../middleware/auth');

router.route('/')
    .get(protect, async (req, res) => {
        try {
            const visitors = await Visitor.find({});
            res.json(visitors);
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    })
    .post(protect, async (req, res) => {
        try {
            const visitor = await Visitor.create(req.body);
            res.status(201).json(visitor);
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    });

router.route('/:id')
    .put(protect, async (req, res) => {
        try {
            const visitor = await Visitor.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.json(visitor);
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    })
    .delete(protect, admin, async (req, res) => {
        try {
            await Visitor.findByIdAndDelete(req.params.id);
            res.json({ message: 'Visitor removed' });
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    });

module.exports = router;

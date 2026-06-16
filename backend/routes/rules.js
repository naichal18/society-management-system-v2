const express = require('express');
const router = express.Router();
const Rule = require('../models/Rule');
const { protect, admin } = require('../middleware/auth');

router.route('/')
    .get(protect, async (req, res) => {
        try {
            const rules = await Rule.find({});
            res.json(rules);
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    })
    .post(protect, admin, async (req, res) => {
        try {
            const rule = await Rule.create(req.body);
            res.status(201).json(rule);
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    });

router.route('/:id')
    .put(protect, admin, async (req, res) => {
        try {
            const rule = await Rule.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.json(rule);
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    })
    .delete(protect, admin, async (req, res) => {
        try {
            await Rule.findByIdAndDelete(req.params.id);
            res.json({ message: 'Rule removed' });
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    });

module.exports = router;

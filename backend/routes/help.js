const express = require('express');
const router = express.Router();
const HelpContact = require('../models/HelpContact');
const { protect, admin } = require('../middleware/auth');

router.route('/')
    .get(protect, async (req, res) => {
        try {
            const helpContacts = await HelpContact.find({});
            res.json(helpContacts);
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    })
    .post(protect, admin, async (req, res) => {
        try {
            const helpContact = await HelpContact.create(req.body);
            res.status(201).json(helpContact);
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    });

router.route('/:id')
    .put(protect, admin, async (req, res) => {
        try {
            const helpContact = await HelpContact.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.json(helpContact);
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    })
    .delete(protect, admin, async (req, res) => {
        try {
            await HelpContact.findByIdAndDelete(req.params.id);
            res.json({ message: 'HelpContact removed' });
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    });

module.exports = router;

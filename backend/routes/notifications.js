const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');

router.route('/')
    .get(protect, async (req, res) => {
        try {
            const notifications = await Notification.find({});
            res.json(notifications);
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    })
    .post(protect, async (req, res) => {
        try {
            const notification = await Notification.create(req.body);
            res.status(201).json(notification);
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    })
    .put(protect, async (req, res) => { // Mark all read
        try {
            await Notification.updateMany({}, { read: true });
            res.json({ message: 'All marked as read' });
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    })
    .delete(protect, async (req, res) => { // Clear all
        try {
            await Notification.deleteMany({});
            res.json({ message: 'All notifications cleared' });
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    });

module.exports = router;

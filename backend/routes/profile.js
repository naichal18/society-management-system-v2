const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// GET /api/profile
router.get('/', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// PUT /api/profile — update personal + flat + notifPrefs
router.put('/', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        const fields = ['name','email','phone','emergencyContact','dob','photo','block','floor','ownershipStatus','moveInDate','notifPrefs'];
        fields.forEach(f => { if (req.body[f] !== undefined) user[f] = req.body[f]; });
        await user.save();
        const updated = await User.findById(req.user.id).select('-password');
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: 'Server Error: ' + err.message });
    }
});

// PUT /api/profile/password
router.put('/password', protect, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!newPassword || newPassword.length < 6) return res.status(400).json({ message: 'New password must be at least 6 characters' });
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        const ok = await user.matchPassword(currentPassword);
        if (!ok) return res.status(400).json({ message: 'Current password is incorrect' });
        user.password = newPassword;
        await user.save();
        res.json({ message: 'Password changed successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// PUT /api/profile/vehicles — replace entire vehicles array
router.put('/vehicles', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        user.vehicles = req.body.vehicles || [];
        await user.save();
        res.json(user.vehicles);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// PUT /api/profile/family — replace entire familyMembers array
router.put('/family', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        user.familyMembers = req.body.familyMembers || [];
        await user.save();
        res.json(user.familyMembers);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;

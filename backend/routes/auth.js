const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Resident = require('../models/Resident');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role, name: user.name, flat: user.flat || 'N/A' },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );
};

// @route POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, phone, password, role } = req.body;
    try {
        // Find user by email or phone
        const query = [];
        if (email) query.push({ email });
        if (phone) query.push({ phone });
        
        let user = await User.findOne({ 
            $or: query.length ? query : [{ email: '' }],
            role: role
        });

        if (user && (await user.matchPassword(password))) {
            user.lastLogin = new Date();
            await user.save();
            return res.json({
                token: generateToken(user),
                role: user.role,
                name: user.name,
                flat: user.unit || user.flat || 'Admin'
            });
        }

        return res.status(401).json({ message: 'Invalid credentials' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route POST /api/auth/signup
router.post('/signup', async (req, res) => {
    const { name, flat, phone, email, password } = req.body;
    try {
        const query = [];
        if (email) query.push({ email });
        if (phone) query.push({ phone });

        const userExists = await User.findOne({ $or: query.length ? query : [{ email: '' }] });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this email or phone' });
        }

        const user = await User.create({
            name,
            flat,
            phone,
            email,
            password,
            role: 'resident',
            block: 'A Wing',
            floor: '1st Floor',
            ownershipStatus: 'Owner',
            moveInDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
        });

        // Also add to resident directory
        await Resident.create({ name, flat, phone, email, vehicles: 0 });

        res.status(201).json({ message: 'Signup successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
});

module.exports = router;

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    flat: { type: String },
    phone: { type: String },
    email: { type: String },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'resident'], default: 'resident' },
    // Extended profile fields
    emergencyContact: { type: String, default: '' },
    dob: { type: String, default: '' },
    photo: { type: String, default: '' },
    block: { type: String, default: '' },
    floor: { type: String, default: '' },
    ownershipStatus: { type: String, default: 'Owner' },
    moveInDate: { type: String, default: '' },
    lastLogin: { type: Date },
    vehicles: [{ type: { type: String }, number: { type: String } }],
    familyMembers: [{ name: { type: String }, relation: { type: String }, age: { type: String } }],
    notifPrefs: {
        meetings:   { type: Boolean, default: true },
        bills:      { type: Boolean, default: true },
        complaints: { type: Boolean, default: true },
        visitors:   { type: Boolean, default: true }
    }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

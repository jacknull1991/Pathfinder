const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        max: 255,
        min: 6
    },
    password: {
        type: String,
        required: true,
        trim: true,
        max: 1024,
        min: 8,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        max: 255
    },
    nickname: {
        type: String,
        required: false,
        trim: true,
        max: 255
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;
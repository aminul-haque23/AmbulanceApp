const mongoose = require('mongoose');

/**
 * UserSchema defines how user data is stored in MongoDB.
 * - name:      full name of the user
 * - email:     unique identifier used for login
 * - password:  hashed password string
 * - role:      string enum to control access ('user', 'manager', 'admin')
 * - date:      timestamp when the user was created
 */

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'driver', 'admin'],
        default: 'user'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);
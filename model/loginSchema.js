const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LoginSchema = new Schema({
    username: String,
    password: String,
    utime: {
        type: Date,
        default: Date.now,
    },
    ctime: {
        type: Date,
        default: Date.now,
    },
});

module.exports = LoginSchema;

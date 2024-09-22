const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var PagesSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    ctime: {
        type: Date,
        default: Date.now
    },
    town: {
        type: String,
        required: true
    }
});

module.exports = PagesSchema;

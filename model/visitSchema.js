const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VisitSchema = new Schema({
    time: {
        type: Date,
        required: true,
    },
    persion: {
        type: Number,
        required: true,
    }
});

module.exports = VisitSchema;

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

var PagesSchema = new Schema({
    title: String,
    content: String,
    ctime: {
        type: Date,
        default: Date.now
    },
    town: {
        type: String,
        required: true
    }
});
PagesSchema.plugin(mongoosePaginate)

module.exports = PagesSchema;

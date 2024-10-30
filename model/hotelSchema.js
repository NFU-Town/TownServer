const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hotelSchema = new Schema({
    name: String,
    info: String,
    pictureurl: String,
    erweimapic: String,
});

module.exports = hotelSchema;
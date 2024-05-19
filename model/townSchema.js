const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var townSchema = new Schema({
    townname : String,
    tel1 : String,
    tel2 : String,
    tel3 : String,
    townbackground : String,
    townvideo : String,
    townlogo : String,
    townsiderpic : String,
    pagepiclist: Array,
    midpiclist: Array,
    spotlist: Array,
    utime : {
        type: Date, //类型
        default: Date.now // 默认值
    },
    ctime : {
        type: Date, //类型
        default: Date.now // 默认值
    },
});

module.exports = townSchema;
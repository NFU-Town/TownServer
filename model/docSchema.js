const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var SettingSchema = new Schema({
    type : String,
    url: String,
    utime : {
        type: Date, //类型
        default: Date.now // 默认值
    },
    ctime : {
        type: Date, //类型
        default: Date.now // 默认值
    },
});

module.exports = SettingSchema;
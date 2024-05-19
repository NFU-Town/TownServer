const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

var VideoSchema = new Schema({
    name : String,
    info: String,
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
VideoSchema.plugin(mongoosePaginate);


module.exports = VideoSchema;
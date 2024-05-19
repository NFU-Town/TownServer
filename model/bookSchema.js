const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

var BookSchema = new Schema({
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
BookSchema.plugin(mongoosePaginate);


module.exports = BookSchema;
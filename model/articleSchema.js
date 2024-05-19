const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    title : String,
    origin: String,
    town:String,
    sort:String,
    content: String,
    files:Array,
    utime : {
        type: Date, //类型
        default: Date.now // 默认值
    },
    ctime : {
        type: Date, //类型
        default: Date.now // 默认值
    },
});
ArticleSchema.plugin(mongoosePaginate);


module.exports = ArticleSchema;
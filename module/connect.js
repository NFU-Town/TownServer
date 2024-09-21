const mongoose = require('mongoose');
const key = require('../secret/server_key');
const settingSchema = require('../model/settingSchema');
const docSchema = require('../model/docSchema');
const fileSchema = require('../model/fileSchema');
const videoSchema = require('../model/videoSchema');
const bookSchema = require('../model/bookSchema');
const articleSchema = require('../model/articleSchema');
const townSchema = require('../model/townSchema');
const pagesSchema = require('../model/pagesSchema');

var mongooses = mongoose.createConnection(key.mongourl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function (err) {
    if (err) {
        console.log("连接失败");
        console.log(err);
    } else {
        console.log("Mongoose数据库连接成功")
    }

});

var db = {}

db.settingfind = (type) => {
    settingfinddata = mongooses.model("setting", settingSchema, "setting");
    return settingfinddata.findOne({ type: type });
}

db.settingupdate = (type, config) => {
    settingfinddata = mongooses.model("setting", settingSchema, "setting");
    var updatedata = { utime: new Date() }
    for (index in config) {
        updatedata[`config.0.${index}`] = config[index];
    }
    console.log(updatedata);
    return settingfinddata.updateOne({ type: type }, { $setOnInsert: { ctime: new Date() }, $set: updatedata }, { new: true, upsert: true });
}

db.docfind = (type) => {
    docfinddata = mongooses.model("doc", docSchema, "doc");
    return docfinddata.findOne({ type: type });
}

db.docupdate = (type, url) => {
    docupdatedata = mongooses.model("doc", docSchema, "doc");
    var updatedata = { utime: new Date(), url: url }
    return docupdatedata.updateOne({ type: type }, { $setOnInsert: { ctime: new Date() }, $set: updatedata }, { new: true, upsert: true });
}
db.fileupdate = (name, info, url) => {
    fileupdatedata = mongooses.model("file", fileSchema, "file");
    var updatedata = { utime: new Date(), url: url, name: name, info: info }
    return fileupdatedata.updateOne({ url: url }, { $setOnInsert: { ctime: new Date() }, $set: updatedata }, { new: true, upsert: true });
}
db.filefind = (page) => {
    filefinddata = mongooses.model("file", fileSchema, "file");
    return filefinddata.paginate({}, {
        sort: {
            "ctime": -1
        },
        limit: 10,
        page: page ? page : 0
    })
}
db.videoupdate = (name, info, url) => {
    videoupdatedata = mongooses.model("video", videoSchema, "video");
    var updatedata = { utime: new Date(), url: url, name: name, info: info }
    return videoupdatedata.updateOne({ url: url }, { $setOnInsert: { ctime: new Date() }, $set: updatedata }, { new: true, upsert: true });
}

db.videofind = (page) => {
    videofinddata = mongooses.model("video", videoSchema, "video");
    return videofinddata.paginate({}, {
        sort: {
            "ctime": -1
        },
        limit: 10,
        page: page ? page : 0
    })
}

db.bookupdate = (name, info, url) => {
    bookupdatedata = mongooses.model("book", bookSchema, "book");
    var updatedata = { utime: new Date(), url: url, name: name, info: info }
    return bookupdatedata.updateOne({ url: url }, { $setOnInsert: { ctime: new Date() }, $set: updatedata }, { new: true, upsert: true });
}

db.bookfind = (page) => {
    bookfinddata = mongooses.model("book", bookSchema, "book");
    return bookfinddata.paginate({}, {
        sort: {
            "ctime": -1
        },
        limit: 10,
        page: page ? page : 0
    })
}
db.townupdate = (town, array) => {
    towndata = mongooses.model("town", townSchema, "town");
    var updatedata = array
    updatedata.utime = new Date()
    return towndata.updateOne({ townname: town }, { $setOnInsert: { ctime: new Date() }, $set: updatedata }, { new: true, upsert: true });
}
db.townfindOne = (town) => {
    towndata = mongooses.model("town", townSchema, "town");
    return towndata.findOne({ townname: town })
}
db.townfindlist = () => {
    towndata = mongooses.model("town", townSchema, "town");
    return towndata.find().select('townname _id')
}
db.articleupdate = (title, origin, town, content, sort, files) => {
    articleupdatedata = mongooses.model("article", articleSchema, "article");
    var updatedata = { utime: new Date(), title: title, town: town, origin: origin, content: content, sort: sort, files: files }
    return articleupdatedata.updateOne({ title: title, town: town, sort: sort }, { $setOnInsert: { ctime: new Date() }, $set: updatedata }, { new: true, upsert: true });
}
db.articlefind = (id, sort, town) => {
    articlefinddata = mongooses.model("article", articleSchema, "article");
    return id ? articlefinddata.findOne({ _id: id }) : articlefinddata.findOne({ sort: sort, town: town })

}
db.listsfind = (town, sort, page, limit) => {
    articlefinddata = mongooses.model("article", articleSchema, "article");
    return articlefinddata.paginate({ town: town, sort: sort }, {
        sort: {
            "ctime": -1
        },
        limit: limit <= 10 ? limit : 10,
        page: page ? page : 0,
        select: 'title id origin ctime content'
    })
}
db.pagesfind = (id, town, sort = 'ctime') => {
    Page = mongoose.model("Page", PagesSchema, "pages");
    return Page.findById(id).exec()
        .then(currentPage => {
            if (!currentPage) return { previous: null, next: null };
            const query = { town: town };
            // 获取上一篇文章
            return Page.find({ ...query, [sort]: { $lt: currentPage[sort] } })
                .sort({
                    [sort]: -1
                })  // 获取时间最近的一篇作为上一篇
                .limit(1)
                .exec()
                .then(previousPage => {
                    return Page.find({ ...query, [sort]: { $gt: currentPage[sort] } })
                        .sort({
                            [sort]: 1
                        })  // 获取最早的一篇作为下一篇
                        .limit(1)
                        .exec()
                        .then(nextPage => ({
                            previous: previousPage[0] ? { id: previousPage[0]._id, title: previousPage[0].title } : null,
                            next: nextPage[0] ? { id: nextPage[0]._id, title: nextPage[0].title } : null
                        }));
                });
        })
        .catch(error => {
            console.error('Error finding pages:', error);
            throw error;
        });
}

module.exports = db
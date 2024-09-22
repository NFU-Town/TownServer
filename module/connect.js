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
const VisitSchema = require('../model/visitSchema');

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
    const Page = mongoose.model("article", pagesSchema, "article");
    return Page.findById(id).exec()
        .then(currentPage => {
            if (!currentPage) {
                return { previous: null, next: null };
            }
            const query = { town: town };
            // 获取上一篇文章
            const previousQuery = Page.find({ ...query, [sort]: { $lt: currentPage[sort] } })
                .sort({ [sort]: -1 }) // 按照时间最近的一篇
                .limit(1)
                .exec();
            // 获取下一篇文章
            const nextQuery = Page.find({ ...query, [sort]: { $gt: currentPage[sort] } })
                .sort({ [sort]: 1 }) // 按照时间最早的一篇
                .limit(1)
                .exec();
            return Promise.all([previousQuery, nextQuery])
                .then(([previousPage, nextPage]) => ({
                    previous: previousPage.length ? { id: previousPage[0]._id, title: previousPage[0].title } : null,
                    next: nextPage.length ? { id: nextPage[0]._id, title: nextPage[0].title } : null
                }));
        })
        .catch(error => {
            console.error('Error finding pages:', error);
            throw error;
        });
};

// db.getVisitStats = async () => {
//     const VisitModel = mongooses.model('vis', VisitSchema, 'vis');
//     try {
//         const today = new Date();
//         const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
//         const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
//         const dailyStats = await VisitModel.aggregate([
//             { $match: { time: { $gte: startOfDay } } },
//             { $group: { _id: null, total: { $sum: '$persion' } } }
//         ]);
//         const monthlyStats = await VisitModel.aggregate([
//             { $match: { time: { $gte: startOfMonth } } },
//             { $group: { _id: null, total: { $sum: '$persion' } } }
//         ]);
//         return {
//             dailyVisits: dailyStats[0] ? dailyStats[0].total : 0,
//             monthlyVisits: monthlyStats[0] ? monthlyStats[0].total : 0,
//         };
//     } catch (error) {
//         console.error("获取访问统计时出错:", error);
//         return { dailyVisits: 0, monthlyVisits: 0 };
//     }
// };

// 更新vis表
db.recordVisit = async () => {
    const VisitModel = mongooses.model('vis', VisitSchema, 'vis');
    try {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        // 检查是否已存在今日的访问记录
        const existingVisit = await VisitModel.findOne({ time: { $gte: startOfDay } });
        if (existingVisit) {
            // 如果今天的记录存在，则更新 persion 值
            existingVisit.persion += 1;  // 每次访问增加 1
            await existingVisit.save();
        } else {
            //如果今天的记录不存在，则创建新记录
            const newVisit = new VisitModel({
                time: new Date(),
                persion: 1  //每次访问增加 1
            });
            await newVisit.save();  //保存访问记录
        }
    } catch (error) {
        console.error("记录访问时出错:", error);
    }
};

//文章统计
db.getTownArticleCounts = async () => {
    try {
        const results = await mongooses.model("article", articleSchema, "article").aggregate([
            {
                $group: {
                    _id: "$town",
                    count: { $sum: 1 } //计算每个小镇的文章数量
                }
            },
            {
                $project: {
                    town: "$_id", //将 _id 重命名为 town
                    count: 1,
                    _id: 0
                }
            }
        ]);
        return results;
    } catch (error) {
        console.error('获取小镇文章数量失败:', error);
        throw error;
    }
};



module.exports = db;
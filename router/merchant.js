const Router = require("koa-router");
const db = require("../module/connect");
const router = new Router();
const path = require('path');
const multer = require('koa-multer');
const mammoth = require("mammoth");
const key = require('../secret/server_key');
const COS = require('cos-nodejs-sdk-v5');

const cos = new COS({
    SecretId: key.cos.SecretId, // 推荐使用环境变量获取；用户的 SecretId，建议使用子账号密钥，授权遵循最小权限指引，降低使用风险。子账号密钥获取可参考https://cloud.tencent.com/document/product/598/37140
    SecretKey: key.cos.SecretKey, // 推荐使用环境变量获取；用户的 SecretKey，建议使用子账号密钥，授权遵循最小权限指引，降低使用风险。子账号密钥获取可参考https://cloud.tencent.com/document/product/598/37140
});
const cospath = "town/"  //腾讯云 Cos 桶下的文件夹

async function uploadFile(file, type, directory = 'merchant') {
    try {
        const data = await cos.putObject({
            Bucket: key.cos.Bucket,
            Region: key.cos.Region,
            Key: `${cospath}${directory}/${new Date().getTime()}.${type}`, // 创建目录
            Body: file.buffer,
            onProgress: function (progressData) {
                console.log(progressData);
            }
        });
        const imageUrl = `https://${data.Location}`;
        return imageUrl;
    } catch (error) {
        console.log(error);
        throw new Error('File upload failed');
    }
}

let filestorage = multer.memoryStorage()
const filelimits = {
    fields: 10,//非文件字段的数量
    files: 1//文件数量
}

let fileupload = multer({
    storage: filestorage,
    limits: filelimits
}).single('file');

router.post('/merchantupload', async (ctx, next) => {
    let err = await fileupload(ctx, next)
        .then(res => res)
        .catch(err => err);

    if (err) {
        ctx.body = {
            code: -1,
            msg: err.message
        };
    } else {
        const uploadedFile = ctx.req.file;
        const origintype = uploadedFile.originalname.split('.').pop();
        const url = await uploadFile(uploadedFile, origintype, 'merchant'); // 指定目录为 merchant
        ctx.body = {
            code: 200,
            data: url // 返回 HTTPS 链接
        };
    }
});


module.exports = router.routes();

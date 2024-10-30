const Router = require("koa-router");
const db = require("../module/connect");
const router = new Router();
const path = require('path');
const libre = require('libreoffice-convert');
const multer = require('koa-multer');
const fs = require('fs');
const mammoth = require("mammoth");
const key = require('../secret/server_key');
const COS = require('cos-nodejs-sdk-v5');

const cos = new COS({
  SecretId: key.cos.SecretId, // 推荐使用环境变量获取；用户的 SecretId，建议使用子账号密钥，授权遵循最小权限指引，降低使用风险。子账号密钥获取可参考https://cloud.tencent.com/document/product/598/37140
  SecretKey: key.cos.SecretKey, // 推荐使用环境变量获取；用户的 SecretKey，建议使用子账号密钥，授权遵循最小权限指引，降低使用风险。子账号密钥获取可参考https://cloud.tencent.com/document/product/598/37140
});
const cospath = "town/"  //腾讯云 Cos 桶下的文件夹

async function uploadFile(file, type) {
  try {
    const data = await cos.putObject({
      Bucket: key.cos.Bucket, // 存储桶名称
      Region: key.cos.Region, // 存储桶所在地域
      Key: cospath + new Date().getTime() + `.${type}`, // 可以理解为图片存储的路径+名称(唯一) 例如：indexImages/1670050961361.png
      Body: file.buffer, // 上传文件的内容，可以为 FileStream、字符串、Buffer, 我们这里接收二进制Buffer
      onProgress: function (progressData) {
        console.log(progressData)
      }
    })
    const imageUrl = `https://${data.Location}`
    return imageUrl
  }
  catch (error) {
    console.log(error)
  }
}

// 文件上传
let filestorage = multer.memoryStorage()
const filelimits = {
  fields: 10,//非文件字段的数量
  files: 1//文件数量
}

let fileupload = multer({
  storage: filestorage,
  limits: filelimits
}).single('file');

router.post('/file', async (ctx, next) => {
  let err = await fileupload(ctx, next)
    .then(res => res)
    .catch(err => err)

  if (err) {
    ctx.body = {
      code: -1,
      msg: err.message
    }
  } else {
    const uploadedFile = ctx.req.file;
    const origintype = ctx.req.file.originalname.split('.')[1]
    const url = await uploadFile(uploadedFile, origintype)
    ctx.body = {
      code: 200,
      data: url
    }
  }
});

//实验书上传
let bookstorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/book'))
  },
  filename: (ctx, file, cb) => {
    cb(null, new Date().valueOf() + "." + file.originalname.split(".")[1]);
  }
});
const booklimits = {
  // fields: 10,//非文件字段的数量
  // fileSize: 50000 * 1024,//文件大小 单位 b
  files: 1//文件数量
}
let bookupload = multer({
  storage: bookstorage,
  limits: booklimits
}).single('file');

router.post('/book', async (ctx, next) => {
  var { name, info } = {
    name: ctx.request.query.name ? ctx.request.query.name : "",
    info: ctx.request.query.info ? ctx.request.query.info : ""
  }
  let err = await bookupload(ctx, next)
    .then(res => res)
    .catch(err => err)
  if (err) {
    ctx.body = {
      code: -1,
      msg: err.message
    }
  } else {
    await db.bookupdate(name, info, "/book/" + ctx.req.file.filename)
    ctx.body = {
      code: 200,
      data: ctx.req.file
    }
  }
});
router.post('/townupdate', async ctx => {
  var { town, arr } = {
    town: ctx.request.body.townname,
    arr: ctx.request.body
  }
  await db.townupdate(town, arr)
    .then((result) => {
      ctx.body = {
        code: 200,
        data: result,
      };
    })
    .catch((err) => {
      if (err) console.log(err);
      ctx.body = {
        code: -1,
        message: "出错",
      };
    });
})
router.post('/articleupdate', async ctx => {
  var { title, origin, time, town, content, sort, fileslist } = {
    title: ctx.request.body.title,
    origin: ctx.request.body.origin,
    time: ctx.request.body.time,
    town: ctx.request.body.town,
    content: ctx.request.body.content,
    sort: ctx.request.body.sort,
    fileslist: ctx.request.body.fileslist,
  }
  await db.articleupdate(title, origin, town, content, sort, fileslist)
    .then((result) => {
      ctx.body = {
        code: 200,
        data: result,
      };
    })
    .catch((err) => {
      if (err) console.log(err);
      ctx.body = {
        code: -1,
        message: "出错",
      };
    });
})
let doctempstorage = multer.diskStorage(({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/file'))
  },
  filename: (ctx, file, cb) => {
    cb(null, 'temp');
  }
}));
const doctemplimits = {
  fields: 10,//非文件字段的数量
  files: 1//文件数量
}
let doctempupload = multer({
  storage: doctempstorage,
  limits: doctemplimits
}).single('file');
router.post('/convert', async (ctx, next) => {
  let err = await doctempupload(ctx, next)
    .then(res => res)
    .catch(err => err)
  if (err) {
    ctx.body = {
      code: -1,
      msg: err.message
    }
  } else {
    try {
      const result = await mammoth.convertToHtml({ path: path.join(__dirname, '../public/file/temp') }); // 调用mammoth进行转换
      // 返回转换后的HTML内容
      return ctx.body = {
        code: 200,
        data: result.value,
      };
    } catch (error) {
      console.log(error)
      return ctx.body = {
        code: -1,
        message: `转换失败： ${error}`,
      }
    }


  }
});

module.exports = router.routes();

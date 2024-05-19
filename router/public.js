const Router = require("koa-router");
const db = require("../module/connect");
var mammoth = require("mammoth");
var path = require("path");
const router = new Router();

router.get('/home', async ctx => {
    await db.settingfind(ctx.request.url.split('/').pop())
        .then((result) => {
            ctx.body = JSON.stringify({
                code: 200,
                data: result,
            });
        })
        .catch(async (err) => {
            if (err) console.log(err);
            ctx.body = JSON.stringify({
                code: -1,
                message: "出错",
            }).toString();
        });
})

router.get('/pageinfo/:type', async ctx => {
    await db.docfind(ctx.params.type)
        .then((result) => {
            ctx.body = JSON.stringify({
                code: 200,
                data: result,
            });
        })
        .catch(async (err) => {
            if (err) console.log(err);
            ctx.body = JSON.stringify({
                code: -1,
                message: "出错",
            }).toString();
        });
})

router.get('/files', async ctx => {
    if(!ctx.request.query.page){
        return  ctx.body = JSON.stringify({
            code: -1,
            message: "出错",
        }).toString();
    }
    await db.filefind(ctx.request.query.page)
        .then((result) => {
            ctx.body = JSON.stringify({
                code: 200,
                data: result,
            });
        })
        .catch(async (err) => {
            if (err) console.log(err);
            ctx.body = JSON.stringify({
                code: -1,
                message: "出错",
            }).toString();
        });
})

router.get('/videos', async ctx => {
    if(!ctx.request.query.page){
        return  ctx.body = JSON.stringify({
            code: -1,
            message: "出错",
        }).toString();
    }
    await db.videofind(ctx.request.query.page)
        .then((result) => {
            ctx.body = JSON.stringify({
                code: 200,
                data: result,
            });
        })
        .catch(async (err) => {
            if (err) console.log(err);
            ctx.body = JSON.stringify({
                code: -1,
                message: "出错",
            }).toString();
        });
})

router.get('/books', async ctx => {
    if(!ctx.request.query.page){
        return  ctx.body = JSON.stringify({
            code: -1,
            message: "出错",
        }).toString();
    }
    await db.bookfind(ctx.request.query.page)
        .then((result) => {
            ctx.body = JSON.stringify({
                code: 200,
                data: result,
            });
        })
        .catch(async (err) => {
            if (err) console.log(err);
            ctx.body = JSON.stringify({
                code: -1,
                message: "出错",
            }).toString();
        });
})

module.exports = router.routes();
const Router = require("koa-router");
const db = require("../module/connect");
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

router.get('/articles', async ctx => {
    if(!(ctx.request.query.id||ctx.request.query.sort)){
        return  ctx.body = JSON.stringify({
            code: -1,
            message: "出错",
        }).toString();
    }
    await db.articlefind(ctx.request.query.id,ctx.request.query.sort,ctx.request.query.town)
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

router.post('/lists', async ctx => {
    if(!ctx.request.body.page){
        return  ctx.body = JSON.stringify({
            code: -1,
            message: "出错",
        }).toString();
    }
    await db.listsfind(ctx.request.body.town,ctx.request.body.sort,ctx.request.body.page,ctx.request.body.limit*1)
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

router.post('/findtown', async ctx => {
    if(!ctx.request.body.town){
        return  ctx.body = JSON.stringify({
            code: -1,
            message: "出错",
        }).toString();
    }
    await db.townfindOne(ctx.request.body.town)
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
router.post('/townlists', async ctx => {
    await db.townfindlist()
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
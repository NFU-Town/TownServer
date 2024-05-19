const Router = require("koa-router");
const db = require("../module/connect");
const router = new Router();

router.post('/home',async ctx => {
    var {type,config} = {
        type :ctx.request.url.split('/').pop(),
        config: ctx.request.body.config
    }
    await db.settingupdate(type,config)
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


module.exports = router.routes();
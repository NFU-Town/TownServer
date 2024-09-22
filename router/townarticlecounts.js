const Router = require("koa-router");
const db = require("../module/connect");
const router = new Router();

router.get('/townarticlecounts', async ctx => {
    try {
        const townCounts = await db.getTownArticleCounts();
        ctx.body = townCounts;
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: "获取访问统计时出错" };
        console.error("获取访问统计时出错:", error);
    }
});

module.exports = router.routes();
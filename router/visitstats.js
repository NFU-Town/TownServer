// 修正后的代码
const Router = require("koa-router");
const db = require("../module/connect");
const router = new Router();

router.get('/visitstats', async ctx => {
    try {
        const visitStats = await db.getVisitStats();
        ctx.body = {
            dailyVisits: visitStats.dailyVisits,
            monthlyVisits: visitStats.monthlyVisits
        };
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: "获取访问统计时出错" };
        console.error("获取访问统计时出错:", error);
        console.error("堆栈信息:", error.stack);
    }
});

module.exports = router.routes();


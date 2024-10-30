const Router = require("koa-router");
const db = require("../module/connect");
const router = new Router();

router.get('/hotel', async (ctx) => {  // 路由 /hotel
    try {
        const hotellist = await db.hotelFind();  // 获取酒店列表
        ctx.body = hotellist;
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: '获取酒店列表失败' };
        console.error("获取酒店列表失败:", error);
    }
});

module.exports = router.routes();  // 导出路由

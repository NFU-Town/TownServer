const Router = require("koa-router");
const db = require("../module/connect");
const router = new Router();

router.get('/login', async ctx => {
    const { username, password } = ctx.query; // 从查询参数中获取用户名和密码
    try {
        const user = await db.loginFind(username, password);
        if (user) {
            ctx.body = { success: true };
        } else {
            ctx.body = { success: false, message: '账号或密码错误' };
        }
    } catch (err) {
        console.error('Error during login:', err);
        ctx.status = 500;
        ctx.body = { success: false, message: '服务器错误' };
    }
});
module.exports = router.route();

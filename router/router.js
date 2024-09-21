const Router = require('koa-router');

const upload = require('./upload');
const find = require('./find');
const update = require('./update');

const public = require('./public');



const router = new Router();

router.use("/public",public);

router.use("/apis/upload",upload);
router.use("/apis/find",find);
router.use("/apis/update",update);




module.exports = router;
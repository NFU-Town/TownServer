const Router = require('koa-router');

const upload = require('./upload');
const find = require('./find');
const update = require('./update');

const public = require('./public');
const visitstats = require('./visitstats');
const townarticlecounts = require('./townarticlecounts');
const hotel = require('./hotel');
const merchant = require('./merchant');
// const login = require('./login');


const router = new Router();

router.use("/public", public);
router.use("/apis/upload", upload);
router.use("/apis/find", find);
router.use("/apis/update", update);
router.use("/apis", visitstats);
router.use("/apis", townarticlecounts);
router.use("/apis", hotel);
router.use("/apis", merchant);
// router.use("/apis", login);


module.exports = router;
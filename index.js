const Koa = require('koa');
var cors = require('koa2-cors');
const bodyParser = require('koa-bodyparser');
const router = require('./router/router.js');
const app = new Koa();
const path = require('path');
const staticFiles = require('koa-static');
const range = require('koa-range');
app.use(range);
app.use(staticFiles(path.join(__dirname + '/public/')))
app.use(bodyParser({multipart: true}))
app.use(cors())
app.use(router.routes())
app.use(router.allowedMethods())

process.on('uncaughtException', (e) => {
    console.log(e)
});
port=10123
app.listen(port, '127.0.0.1', () => {
    console.log('town_api_server ok in 127.0.0.1:'+port);
})

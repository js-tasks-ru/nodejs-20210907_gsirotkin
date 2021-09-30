const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

let subscribers = {};

router.get('/subscribe', async (ctx, next) => {

    let id = Math.random();

    subscribers[id] = ctx;

    await new Promise(resolve => {
        ctx.req.on('close', _ => {
            delete subscribers[id];
            resolve();
        });
    });
});

router.post('/publish', async (ctx, next) => {
    if( ctx.request.body.message ) return next();
    ctx.status = 400;
});

router.post('/publish', async (ctx, next) => {
    let message = ctx.request.body.message;
    
    for(let id in subscribers){
        subscribers[id].status = 200;
        subscribers[id].res.end(message);
    }

    ctx.body = message;
});

app.use(router.routes());

module.exports = app;
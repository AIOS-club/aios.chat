import Router from 'koa-router';
import axios from 'axios';

const router = new Router();

router.get('/aios-chat', async (ctx) => {
  ctx.status = 200;
  ctx.body = 'hello, world';
});

export default router;

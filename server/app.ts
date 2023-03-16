import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from 'koa2-cors';
import router from './routers/routers';

const app = new Koa();

app.use(bodyParser());

app.use(cors());

app.use(router.routes());

app.listen(3000, () => {
  console.log('Server is running on port 3000.');
});

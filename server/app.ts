import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from 'koa2-cors';
import * as dotenv from 'dotenv';
import router from './routers/routers';

dotenv.config({ path: process.env.NODE_ENV === 'production' ? './server/.env.production' : './server/.env.development' });

const app = new Koa();

app.use(bodyParser());

app.use(cors());

app.use(router.routes());

app.listen(3000, () => {
  console.log('Server is running on port 3000.');
});

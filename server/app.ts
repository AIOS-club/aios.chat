import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from 'koa2-cors';
import router from './routers/routers';

const app = new Koa();
let port = Number(process.env.PORT) || 3000;
app.use(bodyParser());

app.use(cors());

app.use(router.routes());

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});

app.on('error', (err, ctx) => {
  if (err.code === 'EADDRINUSE') { // 如果端口被占用
    console.log(`Port ${port} is in use, trying another...`);
    port += 1;
    app.listen(port); // 尝试监听下一个端口
  } else {
    console.error('Server error', err);
  }
});

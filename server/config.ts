import * as dotenv from 'dotenv';
import fs from 'fs';

function loadEnv() {
  if (process.env.NODE_ENV === 'production') {
    dotenv.config();
  } else {
    dotenv.config({ path: './server/.env.development' });
  }
}

loadEnv();

// 监听 .env 文件的更改并重新加载环境变量
fs.watch('./server/.env.development', (eventType, filename) => {
  if (eventType === 'change' && filename === '.env.development') {
    console.log('.env file changed. Reloading environment variables...');
    loadEnv();
  }
});

export default process.env;

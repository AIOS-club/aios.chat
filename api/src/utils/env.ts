import * as dotenv from 'dotenv';
import fs from 'fs';

function loadEnv() {
  if (process.env.NODE_ENV === 'production') {
    dotenv.config();
  } else {
    dotenv.config({ path: './api/.env.development' });
  }
}

loadEnv();

if (process.env.NODE_ENV !== 'production') {
  fs.watch('./api/.env.development', (eventType, filename) => {
    if (eventType === 'change' && filename === '.env.development') {
      loadEnv();
    }
  });
}

export default process.env;

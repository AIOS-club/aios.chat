import * as dotenv from 'dotenv';
import fs from 'fs';

function loadEnv() {
  try {
    if (process.env.NODE_ENV === 'production') {
      dotenv.config();
    } else {
      dotenv.config({ path: './api/.env.development' });
    }
  } catch {
    dotenv.config();
  }
}

loadEnv();

if (process.env.NODE_ENV !== 'production') {
  try {
    fs.watch('./api/.env.development', (eventType, filename) => {
      if (eventType === 'change' && filename === '.env.development') {
        loadEnv();
      }
    });
  } catch {
    
  }
}

export default process.env;

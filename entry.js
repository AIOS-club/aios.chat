const fs = require('fs');
const os = require('os');

// 设置前端默认值
const frontEnv = {
  VITE_DEFAULT_PLACEHOLDER: '发消息给AI',
  VITE_DEFAULT_BOTTOM_TIPS: '""',
  VITE_API_HOST: 'http://localhost:3000/aios-chat',
  VITE_CACHE_TIMES: 10,
  VITE_ONLY_TEXT: true,
  VITE_BASE_URL: '/',
  VITE_AI_AVATOR_URL: '""',
  VITE_LOGO_URL:'""',
  VITE_USER_AVATOR_URL:'""',
};

// 设置后端默认值
const backEnv = {
  API_KEY: '""',
  PORT: 3000,
  RETRIES: 3,
}

function getEnvString(obj) {
  let envString = '';

  for (const key in obj) {
    if (process.env[key]) {
      obj[key] = process.env[key];
    }
    envString += `${key}=${obj[key]}${os.EOL}`;
  }

  return envString;
}

const frontEnvString = getEnvString(frontEnv);
const backEnvString = getEnvString(backEnv);

if (!fs.existsSync('.env.development')) {
  fs.writeFileSync('.env.development', frontEnvString);
}

if (!fs.existsSync('./server/.env.development')) {
  fs.writeFileSync('./server/.env.development', backEnvString);
}

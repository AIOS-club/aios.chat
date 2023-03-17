import * as dotenv from 'dotenv';

dotenv.config({ path: process.env.NODE_ENV === 'production' ? './server/.env' : './server/.env.development' });

export default process.env;

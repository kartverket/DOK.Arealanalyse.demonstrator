import dotenv from 'dotenv';

dotenv.config({ path: '.env'});
dotenv.config({ path: '.env.local', override: true });

const config = {
    CACHE_DAYS: process.env.CACHE_DAYS,
    CACHE_DIR: process.env.CACHE_DIR,
    LOG_DIR: process.env.LOG_DIR
};

export default config

import fs from 'node:fs';
import SimpleLogger from 'simple-node-logger';
import config from './config.js';

const options = {
    errorEventName: 'info',
    logDirectory: config.LOG_DIR,
    fileNamePattern: 'binary-creator-<DATE>.log',
    dateFormat: 'YYYY-MM-DD'
};

if (!fs.existsSync(config.LOG_DIR)) {
    fs.mkdirSync(config.LOG_DIR, { recursive: true });
}

const log = SimpleLogger.createRollingFileLogger(options);

export default log;

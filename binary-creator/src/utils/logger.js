import SimpleLogger from 'simple-node-logger';
import 'dotenv/config';

const options = {
    errorEventName: 'info',
    logDirectory: process.env.LOG_DIR,
    fileNamePattern: 'binary-creator-<DATE>.log',
    dateFormat: 'YYYY-MM-DD'
};

const log = SimpleLogger.createRollingFileLogger(options);

export default log;

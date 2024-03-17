const { createLogger, format, transports } = require('winston');
require('dotenv').config();
const logFilePath = process.env.LOG_FILE_PATH || 'webapp.log';

const logger = createLogger({
    transports: [
        new transports.Console(),
        new transports.File({
            filename: logFilePath,
            format: format.combine(
                format.timestamp(),
                format.json()
            )
        })
    ],
    format: format.combine(
        format.timestamp(),
        format.json()
    )
});

module.exports = logger;
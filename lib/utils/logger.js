/* eslint import/no-dynamic-require: 0 */
const os = require('os');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const { check } = require('./environment-check');
const type = require('./types');

const {
  createLogger,
  format,
  transports,
} = require('winston');

const {
  combine,
  timestamp,
  printf,
} = format;

const getConfig = () => {
  try {
    check('LOGGERCONFIG');
    return JSON.parse(fs.readFileSync(process.env.LOGGERCONFIG, 'utf8'));
  } catch (err) {
    return JSON.parse(fs.readFileSync(path.join(__dirname, '../../default-prefs.json'), 'utf8')).logger;
  }
};

const config = getConfig();

const logDirectory = path.resolve(os.homedir() + config.logDirectory);

const logBlacklist = config.blacklist;

const logFormat = printf((info) => {
  if (info.module) {
    return `${info.timestamp} [${info.level}] ${info.module.toUpperCase()}: ${info.message}`;
  }
  return `${info.timestamp} [${info.level}] MAIN: ${info.message}`;
});

// TODO: Improve structure logging
const filterMessage = (message) => {
  if (type(message) === 'Object') {
    return JSON.stringify(_.mapValues(message, (value, key) => {
      if (logBlacklist.includes(key)) { return '<removed>'; }
      return value;
    }));
  }

  return message;
};

const logger = createLogger({
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat,
  ),
  transports: [new transports.File({ filename: path.resolve(logDirectory, config.logLocation) })],
  exitOnError: false,
  maxsize: config.maxSize,
});

logger.moduleLog = (level, module, message) => {
  logger.log({
    level,
    module,
    message: filterMessage(message),
  });
};

module.exports = {
  logger,
};

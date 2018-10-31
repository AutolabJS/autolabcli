/* eslint import/no-dynamic-require: 0 */
const os = require('os');
const _ = require('lodash');
const path = require('path');
const {
  createLogger,
  format,
  transports,
} = require('winston');

const preferenceManager = require('./preference-manager');

const {
  combine,
  timestamp,
  printf,
} = format;

preferenceManager.setPreference({
  name: 'default',
});
const config = preferenceManager.getPreference({ name: 'cliPrefs' }).logger;

const logDirectory = path.resolve(os.homedir(), config.logDirectory);

const logBlacklist = config.blacklist;

const logFormat = printf((info) => {
  if (info.module) {
    return `${info.timestamp} [${info.level}] ${info.module.toUpperCase()}: ${info.message}`;
  }
  return `${info.timestamp} [${info.level}] MAIN: ${info.message}`;
});

const filterMessage = (message) => {
  if (_.isPlainObject(message)) {
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

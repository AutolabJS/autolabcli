const chalk = require('chalk');
const preferenceManager = require('./preference-manager');
const { logger } = require('./logger');

const maxMillisecodsDiff = 2 * 60 * 60 * 1000;

const validateSession = () => {
  const storedTime = preferenceManager.getPreference({ name: 'gitLabPrefs' }).storedTime;
  const currentTime = Date.now();
  if (!storedTime || storedTime === -1 || (currentTime - storedTime > maxMillisecodsDiff)) {
    logger.moduleLog('debug', 'Command Validator', 'Session expired!');
    console.log(chalk.red('Your session has expired. Please run \'autolabjs init\' to login again'));
    preferenceManager.deleteCredentials();
    return false;
  }
  return true;
};

module.exports = {
  validateSession,
};

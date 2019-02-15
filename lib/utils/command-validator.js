const chalk = require('chalk');
const preferenceManager = require('./preference-manager');
const { logger } = require('./logger');

const MSECONDS = 1000;

const { timeouts } = preferenceManager.getPreference({ name: 'cliPrefs' });
const sessionExpiryDuration = timeouts.session; // in seconds
const maxMillisecodsDiff = sessionExpiryDuration * MSECONDS;

const validateSession = () => {
  const { storedTime } = preferenceManager.getPreference({ name: 'gitLabPrefs' });
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

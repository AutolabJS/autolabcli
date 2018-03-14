const chalk = require('chalk');
const preferenceManager = require('./preference-manager');

const maxMillisecodsDiff = 2 * 60 * 60 * 1000;

const validateLocation = () => {
  const locationDirectory = preferenceManager.getLocationDirectory();
  if (!locationDirectory) {
    console.log(chalk.yellow(`Please run 'autolabjs init' command to first initialize your project.`));
    process.exit(0);
  }
  else if (locationDirectory !== process.cwd()) {
    console.log(chalk.red(`You are in the wrong directory. Please move to '${locationDirectory}' and continue.`));
    process.exit(0);
  }
  return true;
}

const validateSession = () => {
  const storedTime = preferenceManager.getStoredTime();
  const currentTime = Date.now();
  if (!storedTime || storedTime === -1 || (currentTime - storedTime > maxMillisecodsDiff)) {
    console.log(chalk.red(`Your session has expired. Please run 'autolabjs init' to login again`));
    preferenceManager.deleteCredentials();
    preferenceManager.removeLocationDirectory();
    process.exit(0);
  }
}

const validateCommand = () => {
  validateLocation() && validateSession();
}

module.exports = {
  validateCommand
}

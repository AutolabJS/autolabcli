const chalk = require('chalk');
const figlet = require('figlet');
const {Spinner} = require('cli-spinner');


const sendWelcome = () => {
  const figletText = figlet.textSync('AutolabJS   CLI', { horizontalLayout: 'default' });
  const yellowFiglet = chalk.yellow(figletText);
  console.log(yellowFiglet);
}

const sendSuccessWelcome = (user) => {
  const message = chalk.green(`\nHi ${user}! Proceed to making commits in this repository. Run 'autolabjs help' for help.`);
  console.log(message);
}

const sendError = (error) => {
  error = chalk.red(error);
  console.log(error);
}

const status = new Spinner('Authenticating you, please wait ...');

const startSpinner = () => {
  status.setSpinnerString(0);
  status.start();
}

const stopSpinner = () => {
  status.stop();
}

module.exports = {
  sendSuccessWelcome,
  sendWelcome,
  sendError,
  startSpinner,
  stopSpinner
}

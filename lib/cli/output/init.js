const chalk = require('chalk');
const figlet = require('figlet');
const {Spinner} = require('cli-spinner');


const sendStartWelcome = () => {
  const figletText = figlet.textSync('AutolabJS   CLI', { horizontalLayout: 'default' });
  const yellowFiglet = chalk.yellow(figletText);
  console.log(yellowFiglet);
}

const spinner = new Spinner('Authenticating you, please wait ...');

const startSpinner = () => {
  spinner.setSpinnerString(0);
  spinner.start();
}

const stopSpinner = () => {
  spinner.stop();
}

const sendSuccessWelcome = (user) => {
  const message = chalk.green(`\nHi ${user}! You have successfully logged into AutolabJS. Run 'autolabjs help' for help.`);
  console.log(message);
}

const sendError = (error) => {
  error = chalk.red(error);
  console.log(error);
}

const handleResponse = (status) => {
  if (status.code === 200) {
    sendSuccessWelcome(status.name);
  }
  else if (status.code === 4) {
    sendError('\nPlease check your network connection');
  }
  else {
    sendError('\nInvalid Username or Password');
  }
}

const sendOutput = (event) => {
  switch (event.name) {

    case 'welcome':
      sendStartWelcome();
      break;

    case 'authentication_started':
      startSpinner();
      break;

    case 'authentication_ended':
      stopSpinner();
      handleResponse(event.details);
      break;
  }
}

module.exports = {
  sendOutput
}

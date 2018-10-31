const chalk = require('chalk');

const sendLogoutMessage = () => {
  const message = chalk.green('Your have been succesfully logged out!');
  console.log(message);
};

const sendOutput = (event) => {
  switch (event.name) {
    case 'logout_success':
      sendLogoutMessage();
      break;
    default:
      console.log(chalk.red('\nInvalid Event'));
  }
};

module.exports = {
  sendOutput,
};

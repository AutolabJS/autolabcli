const inquirer = require('inquirer');

const questions = [
{
  name: 'username',
  type: 'input',
  message: 'Enter your Autolab username',
  validate: function(value) {
    if (value.length) {
      return true;
    }
    else {
      return 'Please enter your username';
    }
  }
},
{
  name: 'password',
  type: 'password',
  message: 'Enter your password:',
  validate: function(value) {
    if (value.length) {
      return true;
    }
    else {
      return 'Please enter your password';
    }
  }
},
];

module.exports = (args, options, logger) => {
  if (options.u && options.p) {
    return onValidInputs(options.u, options.p, logger);
  }
  else {
    inquirer.prompt(questions).then( (answers) => {
      onValidInputs(answers.username, answers.password, logger);
    })
  }
}

function onValidInputs (username, password, logger) {
  logger.info(`Your username is: ${username}`);
  logger.info(`Your password is: ${password}`);
}

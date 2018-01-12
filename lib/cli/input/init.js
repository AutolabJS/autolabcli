const inquirer = require('inquirer');

const questions = [
{
  name: 'username',
  type: 'input',
  message: 'Enter your Autolab username:',
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

const getInput = (args, options) => {
  if (typeof options.u == 'string' && typeof options.p == 'string')
    return new Promise((resolve, reject) => resolve({username: options.u, password: options.p}));

  else
    return inquirer.prompt(questions);
}

module.exports = {
  getInput
}

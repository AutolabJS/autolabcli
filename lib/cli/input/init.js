const inquirer = require('inquirer');

const credentials = [
{
  name: 'username',
  type: 'input',
  message: 'Enter your AutolabJS username:',
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

const areCredentialsValid = (username, password) => {
  return typeof username == 'string' && typeof password == 'string';
}

const getInput = async (args, options) => {
  if (areCredentialsValid(options.u, options.p))
    return {username: options.u, password: options.p};

  else
    return inquirer.prompt(credentials);
}

module.exports = {
  getInput
}

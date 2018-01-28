const inquirer = require('inquirer');
const PromptGenerator = require('../../utils/PromptGenerator');

const getLengthValidator = (invalidMessage) => {
  return (value) => {
    if (value.length) {
      return true;
    }
    else {
      return invalidMessage;
    }
  }
}

const usernamePromptGenerator = new PromptGenerator();
usernamePromptGenerator.addProperty('name', 'username');
usernamePromptGenerator.addProperty('type', 'input');
usernamePromptGenerator.addProperty('message', 'Enter your AutolabJS username:');
usernamePromptGenerator.addProperty('validate', getLengthValidator('Please enter your username'));

const passwordPromptGenerator = new PromptGenerator();
passwordPromptGenerator.addProperty('name', 'password');
passwordPromptGenerator.addProperty('type', 'password');
passwordPromptGenerator.addProperty('message', 'Enter your AutolabJS password:');
passwordPromptGenerator.addProperty('validate', getLengthValidator('Please enter your password'));

const credentials = [
  usernamePromptGenerator.getPrompt(),
  passwordPromptGenerator.getPrompt()
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

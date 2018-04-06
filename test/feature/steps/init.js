const { Given, When, Then, Before, After } = require('cucumber');
const Preferences = require('preferences');
const { exec } = require('child_process');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const path = require('path');
const figlet = require('figlet');
const chalk = require('chalk');
const inquirer = require('inquirer');
const controller = require('../../../lib/controller');
const initInput = require('../../../lib/cli/input/init');
const preferenceManager = require('../../../lib/utils/preference-manager');

chai.use(sinonChai);
chai.should();

global.promptStub = sinon.stub(inquirer, 'prompt');
global.logSpy = sinon.stub(console, 'log');

Given('a valid username as {string} and corresponding password as {string}', (user, pass) => {
  username = user;
  password = pass;
});

When('I run init command with {string} as username and {string} as password using {string}', async (username, password, inputType) => {
  if(inputType === 'flags') {
    process.argv = ['/usr/local/nodejs/bin/node',
      '/usr/local/nodejs/bin/autolabjs', 'init', '-u', username, '-p', password];

    await controller.start();
  }
  else if(inputType === 'prompt') {
    process.argv = ['/usr/local/nodejs/bin/node',
      '/usr/local/nodejs/bin/autolabjs', 'init'];
    global.promptStub.resolves({ username, password });

    await controller.start();
  }
});

let emptyUsernamePrompt, emptyPasswordPrompt;
When('I give empty input to init command at the prompt', async () => {
  const invalidInputTester = () => {
    const credentails = promptStub.getCalls()[0].args[0];
    try {
      emptyUsernamePrompt = promptStub.getCalls()[0].args[0][0].validate('');
      emptyPasswordPrompt = promptStub.getCalls()[0].args[0][1].validate('');
    } catch(e) {}
  }

  global.promptStub.callsFake(invalidInputTester);
  const ret = await initInput.getInput(null, {});
});

Then('My login credentials and private token should be stored locally', () => {
  preferenceManager.getPreference({ name: 'gitLabPrefs' }).privateToken.should.not.be.empty;
});

Then('I should be displayed a warning message when input is given using {string}', (inputType) => {
  global.logSpy.should.have.been.calledWith(chalk.red('\nInvalid Username or Password'));
});

Then('I should be displayed a warning message to give non-empty input', () => {
  global.promptStub.getCalls()[0].args[0][0].validate('testuser2').should.equal(true);
  emptyUsernamePrompt.should.equal('Please enter your username');
  emptyPasswordPrompt.should.equal('Please enter your password');
});

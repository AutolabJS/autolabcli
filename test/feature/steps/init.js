const {
  Given, When, Then, Before, After,
} = require('cucumber');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinonChai = require('sinon-chai');
const chalk = require('chalk');
const inquirer = require('inquirer');
const sinon = require('sinon');

const controller = require('../../../lib/controller');
const initInput = require('../../../lib/cli/input/init');
const preferenceManager = require('../../../lib/utils/preference-manager');
const { logger } = require('../../../lib/utils/logger');


chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.should();

Before(function () {
  this.promptStub = sinon.stub(inquirer, 'prompt');
  this.logSpy = sinon.stub(console, 'log');
  this.loggerStub = sinon.stub(logger, 'log');
});

Given('a valid username as {string} and corresponding password as {string}', function (user, pass) {
  this.username = user;
  this.password = pass;
});

When('I run init command with {string} as username and {string} as password using {string}', async function (username, password, inputType) {
  if (inputType === 'flags') {
    process.argv = ['/usr/local/nodejs/bin/node',
      '/usr/local/nodejs/bin/autolabjs', 'init', '-v', '-u', this.username, '-p', this.password];

    await controller.start();
  } else if (inputType === 'prompt') {
    process.argv = ['/usr/local/nodejs/bin/node',
      '/usr/local/nodejs/bin/autolabjs', 'init', '-v'];
    this.promptStub.resolves({ username, password });

    await controller.start();
  }
});

let emptyUsernamePrompt;
let emptyPasswordPrompt;

When('I give empty input to init command at the prompt', async function () {
  const invalidInputTester = () => {
    const credentials = this.promptStub.getCall(0).args[0];
    emptyUsernamePrompt = credentials[0].validate('');
    emptyPasswordPrompt = credentials[1].validate('');
  };

  this.promptStub.callsFake(invalidInputTester);
  await initInput.getInput(null, {});
});

Then('My login credentials and private token should be stored locally', function (done) {
  // eslint-disable-next-line no-unused-expressions
  preferenceManager.getPreference({ name: 'gitLabPrefs' }).privateToken.should.not.be.empty;

  const gitlabHost = preferenceManager.getPreference({ name: 'cliPrefs' }).gitlab.host;
  this.loggerStub.should.have.been.calledWith({ level: 'info', message: 'Init command invoked.', module: 'init' });
  this.loggerStub.should.have.been.calledWith({
    level: 'debug',
    message: `Login request from ${this.username}. Authenticating...`,
    module: 'Init',
  });
  this.loggerStub.should.have.been.calledWith({
    level: 'debug',
    message: `POST request to https://${gitlabHost}/api/v4/session?login=${this.username}&password=${this.password}`,
    module: 'Init Model',
  });
  this.loggerStub.should.have.been.calledWith({ level: 'debug', message: `Authenticated ${this.username}.`, module: 'Init Model' });
  done();
});

Then('I should be displayed a warning message when invalid input', function (done) {
  this.logSpy.should.have.been.calledWith(chalk.red('\nInvalid Username or Password'));

  const gitlabHost = preferenceManager.getPreference({ name: 'cliPrefs' }).gitlab.host;
  this.loggerStub.should.have.been.calledWith({ level: 'info', message: 'Init command invoked.', module: 'init' });
  this.loggerStub.should.have.been.calledWith({
    level: 'debug',
    message: `Login request from ${this.username}. Authenticating...`,
    module: 'Init',
  });
  this.loggerStub.should.have.been.calledWith({
    level: 'debug',
    message: `POST request to https://${gitlabHost}/api/v4/session?login=${this.username}&password=autolabjs121`,
    module: 'Init Model',
  });
  this.loggerStub.should.have.been.calledWith({
    level: 'error',
    message: 'StatusCodeError: 401 - {"message":"401 Unauthorized"}',
    module: 'Init Model',
  });
  done();
});

Then('I should be displayed a warning message to give non-empty input', async function () {
  this.promptStub.getCall(0).args[0][0].validate('testuser2').should.equal(true);
  emptyUsernamePrompt.should.equal('Please enter your username');
  emptyPasswordPrompt.should.equal('Please enter your password');
});

After(function () {
  this.promptStub.restore();
  this.logSpy.restore();
  this.loggerStub.restore();
});

const {
  Given, When, Then,
} = require('cucumber');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const chalk = require('chalk');
const controller = require('../../../lib/controller');
const preferenceManager = require('../../../lib/utils/preference-manager');

chai.use(sinonChai);
chai.should();

Given('I have already logged in', async function () {
  preferenceManager.setPreference({ name: 'gitLabPrefs', values: { username: 'AutolabJS_Tester' } });
});

When('I run exit command', async function () {
  process.argv = ['/usr/local/nodejs/bin/node',
    '/usr/local/nodejs/bin/autolabjs', 'exit'];
  await controller.start();
});

Then('My login credentials should be removed', function () {
  preferenceManager.getPreference({ name: 'gitLabPrefs' }).privateToken.should.equal('');
  preferenceManager.getPreference({ name: 'gitLabPrefs' }).storedTime.should.equal(-1);
  this.loggerStub.should.have.been.calledWith({ level: 'info', message: 'Exit command invoked.', module: 'Exit' });
  this.loggerStub.should.have.been.calledWith({ level: 'debug', message: 'Valid session! Logging out.', module: 'Exit' });
});

Given('I am NOT logged in', function () {
  preferenceManager.deleteCredentials();
});

Then('I should receive a warning message for invalid exit', function () {
  this.logSpy.should.have.been.calledWith(chalk.red('Your session has expired. Please run \'autolabjs init\' to login again'));
  this.loggerStub.should.have.been.calledWith({ level: 'info', message: 'Exit command invoked.', module: 'Exit' });
  this.loggerStub.should.have.been.calledWith({ level: 'debug', message: 'Session expired!', module: 'Command Validator' });
});

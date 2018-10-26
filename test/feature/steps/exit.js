const {
  Given, When, Then, Before, After,
} = require('cucumber');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const chalk = require('chalk');
const controller = require('../../../lib/controller');
const preferenceManager = require('../../../lib/utils/preference-manager');

chai.use(sinonChai);
chai.should();

Given('I have already logged in', async () => {
  preferenceManager.setPreference({ name: 'gitLabPrefs', values: { username: 'AutolabJS_Tester' } });
});

When('I run exit command', async () => {
  process.argv = ['/usr/local/nodejs/bin/node',
    '/usr/local/nodejs/bin/autolabjs', 'exit'];
  await controller.start();
});

Then('My login credentials should be removed', () => {
  preferenceManager.getPreference({ name: 'gitLabPrefs' }).privateToken.should.equal('');
  preferenceManager.getPreference({ name: 'gitLabPrefs' }).storedTime.should.equal(-1);
});

Given('I am NOT logged in', () => {
  preferenceManager.deleteCredentials();
});

Then('I should receive a warning message for invalid exit', () => {
  global.logSpy.should.have.been.calledWith(chalk.red('Your session has expired. Please run \'autolabjs init\' to login again'));
});

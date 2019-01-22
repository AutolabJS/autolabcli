const {
  Given, When, Then, Before, After, setDefaultTimeout,
} = require('cucumber');
const Preferences = require('preferences');
const { exec } = require('child_process');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const fs = require('fs');
const chalk = require('chalk');
const inquirer = require('inquirer');
const Table = require('cli-table');
const controller = require('controller');
const preferenceManager = require('@utils/preference-manager');
const path = require('path');

chai.use(sinonChai);
chai.should();

setDefaultTimeout(7 * 1000);

const mockOptions = {
  lab: 'test3',
  lang: 'java',
  idNo: 'testuser',
  commitHash: '',
};

Given('I have NOT logged in', () => {
  preferenceManager.deleteCredentials();
});

Given('I have logged in as root', () => {
  preferenceManager.setPreference({ name: 'gitLabPrefs', values: { username: 'root' } });
});

When('I run eval command with using {string}', async (inputType) => {
  process.argv = ['/usr/local/nodejs/bin/node',
    '/usr/local/nodejs/bin/autolabjs', 'eval'];
  if (inputType === 'flags') {
    process.argv = process.argv.concat(['-l', 'test3', '--lang', 'java']);
  } else if (inputType === 'prompt') {
    global.promptStub.resolves(mockOptions);
  }

  await controller.start();
});

When('I run eval command using i flag for id', async () => {
  process.argv = ['/usr/local/nodejs/bin/node',
    '/usr/local/nodejs/bin/autolabjs', 'eval',
    '-l', 'test3', '--lang', 'java', '-i', 'AutolabJS_Tester'];
  await controller.start();
});

When('I run eval command without using i flag for id', async () => {
  process.argv = ['/usr/local/nodejs/bin/node',
    '/usr/local/nodejs/bin/autolabjs', 'eval',
    '-l', 'test3', '--lang', 'java'];
  await controller.start();
});

When('I run eval command with invalid lab', async () => {
  process.argv = ['/usr/local/nodejs/bin/node',
    '/usr/local/nodejs/bin/autolabjs', 'eval',
    '-l', 'test1000', '--lang', 'java'];
  await controller.start();
});

Then('I should be displayed an error message for invalid session', (done) => {
  setTimeout(() => {
    global.logSpy.should.have.been.calledWith(chalk.red('Your session has expired. Please run \'autolabjs init\' to login again'));
    done();
  }, 1500);
});

Then('I should be able to submit for student with the given id', (done) => {
  setTimeout(() => {
    global.logSpy.should.have.been.calledWith(chalk.green('\nSubmission successful. Retreiving results'));
    done();
  }, 6500);
});

Then('I should be displayed an error message for invalid submission', (done) => {
  setTimeout(() => {
    global.logSpy.should.have.been.calledWith(chalk.red('\nAccess Denied. Please try submitting again'));
    done();
  }, 2500);
});
Then('I should be able to make submisison', (done) => {
  setTimeout(() => {
    global.logSpy.should.have.been.calledWith(`${chalk.green('Total Score: ')}0`);
    done();
  }, 7000);
});

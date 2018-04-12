const {
  Given, When, Then, Before, After,
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
const controller = require('../../../lib/controller');
const preferenceManager = require('../../../lib/utils/preference-manager');
const evalModel = require('../../../lib/model/eval');
const path = require('path');
const io = require('socket.io-client');

chai.use(sinonChai);
chai.should();

const mockOptions = {
  lab: 'test3',
  lang: 'java',
  idNo: 'testuser',
  commitHash: '',
};

const mockData = {
  marks: [1, 1],
  comment: ['success', 'success'],
  status: 0,
  log: '',
  penalty: 0,
};

const mockSocket = io('http://localhost:8080');
const fakeCb = () => {
  const len = onScoresStub.getCalls().length;
  const call = onScoresStub.getCalls()[len - 1];
  const arg = call.args[0];
  const cb = call.args[1];
  if (arg === 'scores') { cb(mockData); } else { cb(); }
};
const onScoresStub = sinon.stub(mockSocket, 'on').callsFake(fakeCb);
sinon.stub(io, 'connect').returns(mockSocket);

Given('I have NOT logged in', () => {
  preferenceManager.deleteCredentials();
});

Given('I have logged in as root', () => {
  preferenceManager.setPreference({ name: 'gitLabPrefs' }, { username: 'root' });
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

Then('I should be displayed an error message for invalid session', () => {
  global.logSpy.should.have.been.calledWith(chalk.red('Your session has expired. Please run \'autolabjs init\' to login again'));
});

Then('I should be able to submit for student with the given id', (done) => {
  setTimeout(() => {
    global.logSpy.should.have.been.calledWith(chalk.green('\nSubmission successful. Retreiving results'));
    done();
  }, 0);
});

Then('I should be displayed an error message for invalid submission', (done) => {
  setTimeout(() => {
    global.logSpy.should.have.been.calledWith(chalk.red('\nAccess Denied. Please try submitting again'));
    done();
  }, 0);
});
Then('I should be able to make submisison', (done) => {
  setTimeout(() => {
    global.logSpy.should.have.been.calledWith(`${chalk.green('Total Score: ')}2`);
    done();
  }, 0);
});

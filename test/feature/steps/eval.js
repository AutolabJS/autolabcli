const {
  Given, When, Then, setDefaultTimeout,
} = require('cucumber');
const chai = require('chai');
const fs = require('fs');
const path = require('path');
const sinonChai = require('sinon-chai');
const chalk = require('chalk');
const sinon = require('sinon');

const controller = require('../../../lib/controller');
const preferenceManager = require('../../../lib/utils/preference-manager');

chai.use(sinonChai);
chai.should();

// The Before and the After hooks run before/after each scenario are present in the hook.js file

const MSECONDS = 1000;
const SECONDS = 7;
const defaultTimeoutTime = SECONDS * MSECONDS;
setDefaultTimeout(defaultTimeoutTime);

Given('a valid lab {string} and an invalid lab {string}', function (validLab, invalidLab) {
  this.validLab = validLab;
  this.invalidLab = invalidLab;
});

Given('that the main server host is set from the file {string}', function (file) {
  const prefsPath = path.join(__dirname, file);
  const prefs = JSON.parse(fs.readFileSync(prefsPath, 'utf8'));
  // eslint-disable-next-line camelcase
  const { main_server } = prefs;

  preferenceManager.setPreference({
    name: 'cliPrefs',
    values: {
      main_server,
    },
  });
});

Given('I have NOT logged in', function () {
  preferenceManager.deleteCredentials();
});

Given('I have logged in as root', function () {
  preferenceManager.setPreference({ name: 'gitLabPrefs', values: { username: 'root' } });
});

When('I run eval command with using {string}', async function (inputType) {
  this.lab = this.validLab;
  const mockOptions = {
    lab: this.lab,
    lang: 'java',
    idNo: 'testuser',
    commitHash: '',
  };

  process.argv = ['/usr/local/nodejs/bin/node',
    '/usr/local/nodejs/bin/autolabjs', 'eval', '-v'];
  if (inputType === 'flags') {
    process.argv = process.argv.concat(['-l', this.lab, '--lang', 'java']);
  } else if (inputType === 'prompt') {
    this.promptStub.resolves(mockOptions);
  }

  await controller.start();
});

When('I run eval command using i flag for id', async function () {
  this.lab = this.validLab;
  this.idNo = 'AutolabJS_Tester';
  process.argv = ['/usr/local/nodejs/bin/node',
    '/usr/local/nodejs/bin/autolabjs', 'eval', '-v',
    '-l', this.lab, '--lang', 'java', '-i', 'AutolabJS_Tester'];
  await controller.start();
});

When('I run eval command without using i flag for id', async function () {
  this.lab = this.validLab;
  this.idNo = 'root';
  process.argv = ['/usr/local/nodejs/bin/node',
    '/usr/local/nodejs/bin/autolabjs', 'eval', '-v',
    '-l', this.lab, '--lang', 'java'];
  await controller.start();
});

When('I run eval command with invalid lab', async function () {
  this.lab = this.invalidLab;
  this.idNo = 'AutolabJS_Tester';
  process.argv = ['/usr/local/nodejs/bin/node',
    '/usr/local/nodejs/bin/autolabjs', 'eval', '-v',
    '-l', this.lab, '--lang', 'java'];
  await controller.start();
});

Then('I should be displayed an error message for invalid session, with a maximum wait of {float} seconds', function (waitTime, done) {
  const testSeconds = waitTime;
  const testTimeout = testSeconds * MSECONDS;
  setTimeout(() => {
    this.logSpy.should.have.been.calledWith(chalk.red('Your session has expired. Please run \'autolabjs init\' to login again'));

    this.loggerStub.should.have.been.calledWith({ level: 'info', message: 'Eval command invoked.', module: 'Eval' });
    this.loggerStub.should.have.been.calledWith({ level: 'debug', message: 'Session expired!', module: 'Command Validator' });
    done();
  }, testTimeout);
});

Then('I should be able to submit for student with the given id, with a maximum wait of {float} seconds', function (waitTime, done) {
  const testSeconds = waitTime;
  const testTimeout = testSeconds * MSECONDS;
  setTimeout(() => {
    this.logSpy.should.have.been.calledWith(chalk.green('\nSubmission successful. Retreiving results'));

    const msHost = preferenceManager.getPreference({ name: 'cliPrefs' }).main_server.host;
    const msPort = preferenceManager.getPreference({ name: 'cliPrefs' }).main_server.port;
    this.loggerStub.should.have.been.calledWith({ level: 'info', message: 'Eval command invoked.', module: 'Eval' });
    this.loggerStub.should.have.been.calledWith({ level: 'debug', message: 'Fetching id to submit.', module: 'Eval Input' });
    this.loggerStub.should.have.been.calledWith({ level: 'debug', message: 'Evaluate request for', module: 'Eval' });
    this.loggerStub.should.have.been.calledWith({
      level: 'debug',
      message: `{"name":"evaluate","details":{"idNo":"${this.idNo}","lab":"${this.lab}","lang":"java","commitHash":""}}`,
      module: 'Eval',
    });
    this.loggerStub.should.have.been.calledWith({
      level: 'debug',
      message: `Opening a socket connection to http://${msHost}:${msPort}`,
      module: 'Eval Model',
    });
    this.loggerStub.should.have.been.calledWith({
      level: 'debug',
      message: 'Sucessfully Sumbitted. Evaluated results',
      module: 'Eval Model',
    });
    this.loggerStub.should.have.been.calledWithMatch(sinon.match.has('message', sinon.match('"marks":[0]')));
    done();
  }, testTimeout);
});

Then('I should be displayed an error message for invalid submission, with a maximum wait of {float} seconds', function (waitTime, done) {
  const testSeconds = waitTime;
  const testTimeout = testSeconds * MSECONDS;
  setTimeout(() => {
    this.logSpy.should.have.been.calledWith(chalk.red('\nAccess Denied. Please try submitting again'));

    const msHost = preferenceManager.getPreference({ name: 'cliPrefs' }).main_server.host;
    const msPort = preferenceManager.getPreference({ name: 'cliPrefs' }).main_server.port;
    this.loggerStub.should.have.been.calledWith({ level: 'info', message: 'Eval command invoked.', module: 'Eval' });
    this.loggerStub.should.have.been.calledWith({ level: 'debug', message: 'Fetching id to submit.', module: 'Eval Input' });
    this.loggerStub.should.have.been.calledWith({ level: 'debug', message: 'Evaluate request for', module: 'Eval' });
    if (this.idNo === 'root') {
      this.loggerStub.should.have.been.calledWith({ level: 'debug', message: '{"name":"invalid"}', module: 'Eval' });
    } else {
      this.loggerStub.should.have.been.calledWith({
        level: 'debug',
        message: `{"name":"evaluate","details":{"idNo":"${this.idNo}","lab":"${this.lab}","lang":"java","commitHash":""}}`,
        module: 'Eval',
      });
      this.loggerStub.should.have.been.calledWith({
        level: 'debug',
        message: `Opening a socket connection to http://${msHost}:${msPort}`,
        module: 'Eval Model',
      });
      this.loggerStub.should.have.been.calledWith({ level: 'error', message: 'Invalid options provided.', module: 'Eval Model' });
      this.loggerStub.should.have.been.calledWith({ level: 'debug', message: 'Invalid Lab No', module: 'Eval Model' });
    }
    done();
  }, testTimeout);
});

Then('I should be able to make submisison, with a maximum wait of {float} seconds', function (waitTime, done) {
  const testSeconds = waitTime;
  const testTimeout = testSeconds * MSECONDS;
  setTimeout(() => {
    this.logSpy.should.have.been.calledWith(`${chalk.green('Total Score: ')}0`);

    this.loggerStub.should.have.been.calledWith({ level: 'info', message: 'Eval command invoked.', module: 'Eval' });
    this.loggerStub.should.have.been.calledWith({ level: 'debug', message: 'Fetching id to submit.', module: 'Eval Input' });
    this.loggerStub.should.have.been.calledWith({ level: 'debug', message: 'Evaluate request for', module: 'Eval' });
    this.loggerStub.should.have.been.calledWith({
      level: 'debug',
      message: `{"name":"evaluate","details":{"idNo":"AutolabJS_Tester","lab":"${this.lab}","lang":"java","commitHash":""}}`,
      module: 'Eval',
    });
    this.loggerStub.should.have.been.calledWithMatch(sinon.match.has('message', sinon.match('"marks":[0]')));
    done();
  }, testTimeout);
});

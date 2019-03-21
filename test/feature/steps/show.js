const {
  Given, When, Then,
} = require('cucumber');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chalk = require('chalk');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const Table = require('cli-table');
const util = require('util');

const controller = require('../../../lib/controller');
const preferenceManager = require('../../../lib/utils/preference-manager');

chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.should();

// The Before and the After hooks run before/after each scenario are present in the hook.js file

const MSECONDS = 1000;

Given('I want to know the status of the main server', function () {
  this.mainServerHost = preferenceManager.getPreference({ name: 'cliPrefs' }).main_server.host;
});

Given('I want to know the scoreboard of {string}', function (lab) {
  this.mainServerHost = preferenceManager.getPreference({ name: 'cliPrefs' }).main_server.host;
  this.testLab = lab;
});

Given('I want to know the score of {string} in {string}', function (id, lab) {
  this.mainServerHost = preferenceManager.getPreference({ name: 'cliPrefs' }).main_server.host;
  this.testLab = lab;
  this.id = id;
});

When('I run show command with status', async function () {
  process.argv = ['/usr/local/nodejs/bin/node',
    '/usr/local/nodejs/bin/autolabjs', 'show', 'status'];

  await controller.start();
});

When('I run show command with score using {string}', async function (inputType) {
  process.argv = ['/usr/local/nodejs/bin/node',
    '/usr/local/nodejs/bin/autolabjs', 'show', 'score'];

  if (inputType === 'flags') {
    if (this.id) {
      process.argv = process.argv.concat(['-l', this.testLab, '-i', this.id]);
    } else {
      process.argv = process.argv.concat(['-l', this.testLab]);
    }
  } else if (inputType === 'prompt') {
    this.promptStub.resolves({ lab: this.testLab, id: this.id });
  }

  await controller.start();
});

// eslint-disable-next-line max-lines-per-function
Then('I should be dislayed the main server\'s status, with a maximum wait of {float} seconds', function (waitTime, done) {
  const testSeconds = waitTime;
  const testTimeout = testSeconds * MSECONDS;

  // eslint-disable-next-line max-lines-per-function
  setTimeout(() => {
    const details = {
      components:
        [{
          role: 'execution_node', hostname: this.mainServerHost, port: '8091', status: 'up',
        },
        {
          role: 'execution_node', hostname: this.mainServerHost, port: '8092', status: 'up',
        },
        {
          role: 'execution_node', hostname: this.mainServerHost, port: '8093', status: 'up',
        },
        {
          role: 'execution_node', hostname: this.mainServerHost, port: '8094', status: 'up',
        },
        {
          role: 'execution_node', hostname: this.mainServerHost, port: '8095', status: 'up',
        },
        {
          role: 'execution_node', hostname: this.mainServerHost, port: '8096', status: 'up',
        },
        {
          role: 'execution_node', hostname: this.mainServerHost, port: '8097', status: 'up',
        },
        {
          role: 'execution_node', hostname: this.mainServerHost, port: '8098', status: 'up',
        },
        {
          role: 'execution_node', hostname: this.mainServerHost, port: '8099', status: 'up',
        },
        {
          role: 'execution_node', hostname: this.mainServerHost, port: '8100', status: 'up',
        },
        {
          role: 'load_balancer',
          hostname: this.mainServerHost,
          port: '8081',
          maxLogLength: '256kb',
          cmd: 'log',
          status: 'up',
        }],
    };

    const lineBreakLength = 80;
    const checkStr = `\n${util.inspect(details,
      { compact: true, breakLength: lineBreakLength, colors: true })}`;
    const sliceAmount = -2; // to remove } from the end of the JSON string above.
    this.logSpy.should.have.been.calledWith(sinon.match(checkStr.slice(0, sliceAmount)));

    this.loggerStub.should.have.been.calledWith({ level: 'info', message: 'Show command invoked.', module: 'Show' });
    this.loggerStub.should.have.been.calledWith({ level: 'debug', message: 'Show request for', module: 'Show' });
    this.loggerStub.should.have.been.calledWith({ level: 'debug', message: '{"name":"status"}', module: 'Show' });
    this.loggerStub.should.have.been.calledWith({
      level: 'debug',
      message: `GET request to https://${this.mainServerHost}:9000/status`,
      module: 'Show Model',
    });
    this.loggerStub.should.have.been.calledWith({ level: 'debug', message: 'Fetched status..', module: 'Show Model' });
    done();
  }, testTimeout);
});

// eslint-disable-next-line max-lines-per-function
Then('I should be dislayed the scoreboard, with a maximum wait of {float} seconds', function (waitTime, done) {
  const testSeconds = waitTime;
  const testTimeout = testSeconds * MSECONDS;

  const posColWidth = 10;
  const idColWidth = 15;
  const scoreColWidth = 10;
  const timeColWidth = 23;

  const testScores = [[1, 'testuser1', '10', '2016-04-05 13:10:05']];

  const table = new Table({
    head: ['Position', 'ID Number', 'Score', 'Time'],
    colWidths: [posColWidth, idColWidth, scoreColWidth, timeColWidth],
  });
  table.push(...testScores);

  setTimeout(() => {
    this.logSpy.should.have.been.calledWith(`\n${table.toString()}`);

    this.loggerStub.should.have.been.calledWith({ level: 'info', message: 'Show command invoked.', module: 'Show' });
    this.loggerStub.should.have.been.calledWith({ level: 'debug', message: 'Show request for', module: 'Show' });
    this.loggerStub.should.have.been.calledWith({
      level: 'debug',
      message: JSON.stringify({ name: 'score', details: { lab: this.testLab, id: this.id } }),
      module: 'Show',
    });
    this.loggerStub.should.have.been.calledWith({
      level: 'debug',
      message: `GET request to https://${this.mainServerHost}:9000/scoreboard/${this.testLab}`,
      module: 'Show Model',
    });
    this.loggerStub.should.have.been.calledWith({ level: 'debug', message: 'Fetched scores for lab2', module: 'Show Model' });
    done();
  }, testTimeout);
});

Then('I should be dislayed error message for invalid lab, with a maximum wait of {float} seconds', function (waitTime, done) {
  const testSeconds = waitTime;
  const testTimeout = testSeconds * MSECONDS;

  setTimeout(() => {
    this.logSpy.should.have.been.calledWith(chalk.red('\nInvalid Lab'));

    this.loggerStub.should.have.been.calledWith({ level: 'info', message: 'Show command invoked.', module: 'Show' });
    this.loggerStub.should.have.been.calledWith({ level: 'debug', message: 'Show request for', module: 'Show' });
    this.loggerStub.should.have.been.calledWith({
      level: 'debug',
      message: JSON.stringify({ name: 'score', details: { lab: this.testLab, id: this.id } }),
      module: 'Show',
    });
    this.loggerStub.should.have.been.calledWith({
      level: 'debug',
      message: `GET request to https://${this.mainServerHost}:9000/scoreboard/${this.testLab}`,
      module: 'Show Model',
    });
    this.loggerStub.should.have.been.calledWith({ level: 'debug', message: 'Invalid lab', module: 'Show Model' });
    done();
  }, testTimeout);
});

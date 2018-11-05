const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chalk = require('chalk');
const inquirer = require('inquirer');
const Table = require('cli-table');
const io = require('socket.io-client');
const { logger } = require('../../lib/utils/logger');
const controller = require('../../lib/controller');
const preferenceManager = require('../../lib/utils/preference-manager');
const commandValidator = require('../../lib/utils/command-validator');

chai.use(sinonChai);
chai.should();

const mockOptions = {
  lab: 'test3',
  lang: 'java',
  idNo: 'testuser',
  commitHash: '',
};

const mockCliPref = {
  main_server: {
    host: 'abc.com',
    port: '8080',
  },
};

const mockData = {
  marks: [1, 1],
  comment: ['success', 'success'],
  status: 0,
  log: '',
  penalty: 0,
};

const sandbox = sinon.createSandbox();

// eslint-disable-next-line max-lines-per-function
const testSucessfulSubmission = async () => {
  const logStub = sandbox.stub(console, 'log');
  process.argv = ['/usr/local/nodejs/bin/node',
    '/usr/local/nodejs/bin/autolabjs', 'eval', '--lang', 'java', '-l', 'test3'];
  const mockIo = sandbox.mock(io);
  const mockPreferenceManager = sandbox.mock(preferenceManager);
  const mockcommandValidator = sandbox.mock(commandValidator);
  const mockSocket = io('http://localhost:8080');

  mockcommandValidator.expects('validateSession').once().returns(true);
  mockPreferenceManager.expects('getPreference').withArgs({ name: 'cliPrefs' }).returns(mockCliPref);
  mockPreferenceManager.expects('getPreference').withArgs({ name: 'gitLabPrefs' }).returns({ username: 'testuser' });
  mockIo.expects('connect').once().returns(mockSocket);

  const testCaseColWidth = 15;
  const statusColWidth = 25;
  const scoreColWidth = 15;

  const onScoresStub = sandbox.stub(mockSocket, 'on').withArgs('scores').callsFake(() => {
    const cb = onScoresStub.getCalls()[0].args[1];
    cb(mockData);
  });
  const table = new Table({
    head: [chalk.cyan('Test Case #'), chalk.cyan('Status'), chalk.cyan('Score')],
    colWidths: [testCaseColWidth, statusColWidth, scoreColWidth],
  });
  table.push(
    ['1', 'success', '1'],
    ['2', 'success', '1'],
  );

  await controller.start();
  logStub.should.have.been.calledWith(chalk.green('\nSubmission successful. Retreiving results'));
  logStub.should.have.been.calledWith(table.toString());
  logStub.should.have.been.calledWith(`\n${chalk.yellow('Log :\n')}${Buffer.from(mockData.log, 'base64').toString()}`);
  logStub.should.have.been.calledWith(`${chalk.yellow('Warning: ')}This lab is not active. The result of this evaluation is not added to the scoreboard.`);
  logStub.should.have.been.calledWith(`${chalk.green('Total Score: ')}2`);
  mockIo.verify();
  mockPreferenceManager.verify();
  sandbox.restore();
};

const testInvalidEvent = async () => {
  const logStub = sandbox.stub(console, 'log');
  process.argv = ['/usr/local/nodejs/bin/node',
    '/usr/local/nodejs/bin/autolabjs', 'eval', '--lang', 'java', '-l', 'test3'];
  const mockIo = sandbox.mock(io);
  const mockPreferenceManager = sandbox.mock(preferenceManager);
  const mockcommandValidator = sandbox.mock(commandValidator);
  const mockSocket = io('http://localhost:8080');

  mockcommandValidator.expects('validateSession').once().returns(true);
  mockPreferenceManager.expects('getPreference').withArgs({ name: 'cliPrefs' }).returns(mockCliPref);
  mockPreferenceManager.expects('getPreference').withArgs({ name: 'gitLabPrefs' }).returns({ username: 'testuser' });
  mockIo.expects('connect').once().returns(mockSocket);

  const onScoresStub = sandbox.stub(mockSocket, 'on').withArgs('invalid').callsFake(() => {
    const cb = onScoresStub.getCalls()[0].args[1];
    cb({
      name: 'invalid',
    });
  });

  await controller.start();
  logStub.should.have.been.calledWith(chalk.red('\nAccess Denied. Please try submitting again'));
  mockIo.verify();
  mockPreferenceManager.verify();
  sandbox.restore();
};

// eslint-disable-next-line max-lines-per-function
const testSucessfulSubmissionPrompt = async () => {
  const logStub = sandbox.stub(console, 'log');
  process.argv = ['/usr/local/nodejs/bin/node',
    '/usr/local/nodejs/bin/autolabjs', 'eval'];
  const mockIo = sandbox.mock(io);
  const mockPreferenceManager = sandbox.mock(preferenceManager);
  const mockcommandValidator = sandbox.mock(commandValidator);
  const mockInquirer = sandbox.mock(inquirer);
  const mockSocket = io('http://localhost:8080');

  mockcommandValidator.expects('validateSession').once().returns(true);
  mockPreferenceManager.expects('getPreference').withArgs({ name: 'cliPrefs' }).returns(mockCliPref);
  mockPreferenceManager.expects('getPreference').withArgs({ name: 'gitLabPrefs' }).returns({ username: 'testuser' });
  mockInquirer.expects('prompt').resolves(mockOptions);
  mockIo.expects('connect').once().returns(mockSocket);

  const testCaseColWidth = 15;
  const statusColWidth = 25;
  const scoreColWidth = 15;

  const onScoresStub = sandbox.stub(mockSocket, 'on').withArgs('scores').callsFake(() => {
    const cb = onScoresStub.getCalls()[0].args[1];
    cb(mockData);
  });
  const table = new Table({
    head: [chalk.cyan('Test Case #'), chalk.cyan('Status'), chalk.cyan('Score')],
    colWidths: [testCaseColWidth, statusColWidth, scoreColWidth],
  });
  table.push(
    ['1', 'success', '1'],
    ['2', 'success', '1'],
  );

  await controller.start();
  logStub.should.have.been.calledWith(chalk.green('\nSubmission successful. Retreiving results'));
  logStub.should.have.been.calledWith(table.toString());
  logStub.should.have.been.calledWith(`\n${chalk.yellow('Log :\n')}${Buffer.from(mockData.log, 'base64').toString()}`);
  logStub.should.have.been.calledWith(`${chalk.yellow('Warning: ')}This lab is not active. The result of this evaluation is not added to the scoreboard.`);
  logStub.should.have.been.calledWith(`${chalk.green('Total Score: ')}2`);
  mockIo.verify();
  mockPreferenceManager.verify();
  mockInquirer.verify();
  sandbox.restore();
};

const testSubmissionPending = async () => {
  const logStub = sandbox.stub(console, 'log');
  process.argv = ['/usr/local/nodejs/bin/node',
    '/usr/local/nodejs/bin/autolabjs', 'eval', '--lang', 'java', '-l', 'test3'];
  const mockIo = sandbox.mock(io);
  const mockPreferenceManager = sandbox.mock(preferenceManager);
  const mockcommandValidator = sandbox.mock(commandValidator);
  const mockSocket = io('http://localhost:8080');

  mockcommandValidator.expects('validateSession').once().returns(true);
  mockPreferenceManager.expects('getPreference').withArgs({ name: 'cliPrefs' }).returns(mockCliPref);
  mockPreferenceManager.expects('getPreference').withArgs({ name: 'gitLabPrefs' }).returns({ username: 'testuser' });
  mockIo.expects('connect').once().returns(mockSocket);

  const onScoresStub = sandbox.stub(mockSocket, 'on').withArgs('submission_pending').callsFake(() => {
    const cb = onScoresStub.getCalls()[0].args[1];
    cb({
      name: 'submission_pending',
    });
  });
  await controller.start();
  logStub.should.have.been.calledWith(chalk.yellow('\nYou have a pending submission. Please try after some time.'));
  mockIo.verify();
  mockPreferenceManager.verify();
  sandbox.restore();
};

const testExpiredSession = async () => {
  const logStub = sandbox.stub(console, 'log');
  process.argv = ['/usr/local/nodejs/bin/node',
    '/usr/local/nodejs/bin/autolabjs', 'eval', '--lang', 'java', '-l', 'test3'];
  const mockPreferenceManager = sandbox.mock(preferenceManager);
  preferenceManager.deleteCredentials();

  await controller.start();
  logStub.should.have.been.calledWith(chalk.red('Your session has expired. Please run \'autolabjs init\' to login again'));
  mockPreferenceManager.verify();
  sandbox.restore();
};

describe('Integration test for eval command', () => {
  before(() => {
    logger.transports.forEach((t) => { t.silent = true; }); // eslint-disable-line no-param-reassign
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should display results on succesful submission', testSucessfulSubmission);
  it('should display error message on invalid event', testInvalidEvent);
  it('should display results on succesful submission with prompt input', testSucessfulSubmissionPrompt);
  it('should display message for pending submission', testSubmissionPending);
  it('should show error message for expired session', testExpiredSession);
});

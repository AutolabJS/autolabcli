const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chalk = require('chalk');
const inquirer = require('inquirer');
const Table = require('cli-table');
const io = require('socket.io-client');
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

describe('Integration test for eval command', () => {
  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  it('should display results on succesful submission', async () => {
    const logStub = sandbox.stub(console, 'log');
    process.argv = ['/usr/local/nodejs/bin/node',
      '/usr/local/nodejs/bin/autolabjs', 'eval', '--lang', 'java', '-l', 'test3'];
    const mockIo = sandbox.mock(io);
    const mockPreferenceManager = sandbox.mock(preferenceManager);
    const mockcommandValidator = sandbox.mock(commandValidator);
    const mockInquirer = sandbox.mock(inquirer);
    const mockSocket = io('http://localhost:8080');

    mockcommandValidator.expects('validateSession').once().returns(true);
    mockPreferenceManager.expects('getPreference').withArgs({ name: 'cliPrefs' }).returns(mockCliPref);
    mockPreferenceManager.expects('getPreference').withArgs({ name: 'gitLabPrefs' }).returns({ username: 'testuser' });
    mockIo.expects('connect').once().returns(mockSocket);
    const fakeonScores = () => {
      const cb = onScoresStub.getCalls()[0].args[1];
      cb(mockData);
    };

    const onScoresStub = sandbox.stub(mockSocket, 'on').withArgs('scores').callsFake(fakeonScores);
    const table = new Table({
      head: [chalk.cyan('Test Case #'), chalk.cyan('Status'), chalk.cyan('Score')],
      colWidths: [15, 25, 15],
    });
    table.push(
      ['1', 'success', '1'],
      ['2', 'success', '1'],
    );

    await controller.start();
    logStub.should.have.been.calledWith(chalk.green('\nSubmission successful. Retreiving results'));
    logStub.should.have.been.calledWith(table.toString());
    logStub.should.have.been.calledWith(`\n${chalk.yellow('Log :\n')}${new Buffer(mockData.log, 'base64').toString()}`);
    logStub.should.have.been.calledWith(`${chalk.yellow('Warning: ')}This lab is not active. The result of this evaluation is not added to the scoreboard.`);
    logStub.should.have.been.calledWith(`${chalk.green('Total Score: ')}2`);
    mockIo.verify();
    mockPreferenceManager.verify();
    sandbox.restore();
  });

  it('should display error message on invalid event', async () => {
    const logStub = sandbox.stub(console, 'log');
    process.argv = ['/usr/local/nodejs/bin/node',
      '/usr/local/nodejs/bin/autolabjs', 'eval', '--lang', 'java', '-l', 'test3'];
    mockIo = sandbox.mock(io);
    const mockPreferenceManager = sandbox.mock(preferenceManager);
    const mockcommandValidator = sandbox.mock(commandValidator);
    const mockSocket = io('http://localhost:8080');

    mockcommandValidator.expects('validateSession').once().returns(true);
    mockPreferenceManager.expects('getPreference').withArgs({ name: 'cliPrefs' }).returns(mockCliPref);
    mockPreferenceManager.expects('getPreference').withArgs({ name: 'gitLabPrefs' }).returns({ username: 'testuser' });
    mockIo.expects('connect').once().returns(mockSocket);
    const fakeonScores = () => {
      const cb = onScoresStub.getCalls()[0].args[1];
      cb({
        name: 'invalid',
      });
    };

    const onScoresStub = sandbox.stub(mockSocket, 'on').withArgs('invalid').callsFake(fakeonScores);

    await controller.start();
    logStub.should.have.been.calledWith(chalk.red('\nAccess Denied. Please try submitting again'));
    mockIo.verify();
    mockPreferenceManager.verify();
    sandbox.restore();
  });

  it('should display results on succesful submission with prompt input', async () => {
    const logStub = sandbox.stub(console, 'log');
    process.argv = ['/usr/local/nodejs/bin/node',
      '/usr/local/nodejs/bin/autolabjs', 'eval'];
    mockIo = sandbox.mock(io);
    const mockPreferenceManager = sandbox.mock(preferenceManager);
    const mockcommandValidator = sandbox.mock(commandValidator);
    const mockInquirer = sandbox.mock(inquirer);
    const mockSocket = io('http://localhost:8080');

    mockcommandValidator.expects('validateSession').once().returns(true);
    mockPreferenceManager.expects('getPreference').withArgs({ name: 'cliPrefs' }).returns(mockCliPref);
    mockPreferenceManager.expects('getPreference').withArgs({ name: 'gitLabPrefs' }).returns({ username: 'testuser' });
    mockInquirer.expects('prompt').resolves(mockOptions);
    mockIo.expects('connect').once().returns(mockSocket);
    const fakeonScores = () => {
      const cb = onScoresStub.getCalls()[0].args[1];
      cb(mockData);
    };

    const onScoresStub = sandbox.stub(mockSocket, 'on').withArgs('scores').callsFake(fakeonScores);
    const table = new Table({
      head: [chalk.cyan('Test Case #'), chalk.cyan('Status'), chalk.cyan('Score')],
      colWidths: [15, 25, 15],
    });
    table.push(
      ['1', 'success', '1'],
      ['2', 'success', '1'],
    );

    await controller.start();
    logStub.should.have.been.calledWith(chalk.green('\nSubmission successful. Retreiving results'));
    logStub.should.have.been.calledWith(table.toString());
    logStub.should.have.been.calledWith(`\n${chalk.yellow('Log :\n')}${new Buffer(mockData.log, 'base64').toString()}`);
    logStub.should.have.been.calledWith(`${chalk.yellow('Warning: ')}This lab is not active. The result of this evaluation is not added to the scoreboard.`);
    logStub.should.have.been.calledWith(`${chalk.green('Total Score: ')}2`);
    mockIo.verify();
    mockPreferenceManager.verify();
    mockInquirer.verify();
    sandbox.restore();
  });

  it('should display message for pending submission', async () => {
    const logStub = sandbox.stub(console, 'log');
    process.argv = ['/usr/local/nodejs/bin/node',
      '/usr/local/nodejs/bin/autolabjs', 'eval', '--lang', 'java', '-l', 'test3'];
    mockIo = sandbox.mock(io);
    const mockPreferenceManager = sandbox.mock(preferenceManager);
    const mockcommandValidator = sandbox.mock(commandValidator);
    const mockSocket = io('http://localhost:8080');

    mockcommandValidator.expects('validateSession').once().returns(true);
    mockPreferenceManager.expects('getPreference').withArgs({ name: 'cliPrefs' }).returns(mockCliPref);
    mockPreferenceManager.expects('getPreference').withArgs({ name: 'gitLabPrefs' }).returns({ username: 'testuser' });
    mockIo.expects('connect').once().returns(mockSocket);
    const fakeonScores = () => {
      const cb = onScoresStub.getCalls()[0].args[1];
      cb({
        name: 'submission_pending',
      });
    };

    const onScoresStub = sandbox.stub(mockSocket, 'on').withArgs('submission_pending').callsFake(fakeonScores);
    await controller.start();
    logStub.should.have.been.calledWith(chalk.yellow('\nYou have a pending submission. Please try after some time.'));
    mockIo.verify();
    mockPreferenceManager.verify();
    sandbox.restore();
  });

  it('should show error message for expired session', async () => {
    const logStub = sandbox.stub(console, 'log');
    process.argv = ['/usr/local/nodejs/bin/node',
      '/usr/local/nodejs/bin/autolabjs', 'eval', '--lang', 'java', '-l', 'test3'];
    mockIo = sandbox.mock(io);
    const mockPreferenceManager = sandbox.mock(preferenceManager);
    preferenceManager.deleteCredentials();

    await controller.start();
    logStub.should.have.been.calledWith(chalk.red('Your session has expired. Please run \'autolabjs init\' to login again'));
    mockPreferenceManager.verify();
    sandbox.restore();
  });

});

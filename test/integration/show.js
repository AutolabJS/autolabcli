/* eslint-disable object-curly-newline */
const chai = require('chai');
const childProcess = require('child_process');
const chalk = require('chalk');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const nock = require('nock');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const Table = require('cli-table');
const util = require('util');

const controller = require('../../lib/controller');
const preferenceManager = require('../../lib/utils/preference-manager');
const { logger } = require('../../lib/utils/logger');

let host = 'autolab.bits-goa.ac.in';
let port = '9000';
if (preferenceManager.getPreference({ name: 'cliPrefs' }).main_server) {
  ({ host, port } = preferenceManager.getPreference({ name: 'cliPrefs' }).main_server);
}

chai.use(sinonChai);
chai.should();

const sandbox = sinon.createSandbox();
const testTimeout = 50;

describe('Integration test for show command', function () {
  afterEach(function () {
    sandbox.restore();
  });

  it('should have output as expected on show status command', testShowStatus);
  it('should have output as expected on show score command for a lab when provided with flags', testShowScoreFlags);
  it('should have output as expected on show score command for a student when provided with flags', testShowScoreStudent);
  it('should have output as expected on show score command for a student without flags', testShowScoreStudentPrompt);
  it('should have output as expected when network fails', testNetworkFailure);
  it('should have output as expected on show score command when fs failure occurs', testFsFailure);
});

// eslint-disable-next-line max-lines-per-function
function testShowStatus(done) {
  const logstub = sandbox.stub(console, 'log');
  const mockStdout = sandbox.mock(process.stdout);
  const mocklogger = sandbox.mock(logger).expects('log').atLeast(1);
  const lineBreakLength = 80;

  mockStdout.expects('write').atLeast(1);
  const testStatus = {
    components: [
      { role: 'execution_node', hostname: 'localhost', port: '8091', status: 'up' },
      { role: 'execution_node', hostname: 'localhost', port: '8092', status: 'up' },
      { role: 'load_balancer', hostname: 'localhost', port: '8081', maxLogLength: '256kb', cmd: 'log', status: 'up' },
    ],
    job_queue_length: 0,
    timestamp: 'Sun Feb 03 2019 04:44:16 GMT+0000 (Coordinated Universal Time)',
  };

  const fakeServer = nock(`https://${host}:${port}`)
    .get('/status');
  const httpOK = 200;
  fakeServer.reply(httpOK, testStatus);

  process.argv = ['/usr/local/nodejs/bin/node',
    '/usr/local/nodejs/bin/autolabjs', 'show', 'status'];

  controller.start();

  setTimeout(() => {
    logstub.should.have.been.calledWith(`\n${util.inspect(testStatus,
      { compact: true, breakLength: lineBreakLength, colors: true })}`);
    mocklogger.verify();
    mockStdout.verify();
    done();
  }, testTimeout);
}

// eslint-disable-next-line max-lines-per-function
function testShowScoreFlags(done) {
  const mockStdout = sandbox.mock(process.stdout);
  const mocklogger = sandbox.mock(logger).expects('log').atLeast(1);
  const stubSpawn = sandbox.stub(childProcess, 'spawn');

  mockStdout.expects('write').atLeast(1);
  const testScores = [
    { id_no: 'testuser1', score: '10', time: '5, July 2017 13:12:00' },
    { id_no: 'testuser2', score: '9', time: '5, July 2017 13:05:00' },
  ];
  const posColWidth = 10;
  const idColWidth = 15;
  const scoreColWidth = 10;
  const timeColWidth = 23;

  const formatScore = [['1', 'testuser1', '10', '5, July 2017 13:12:00'],
    ['2', 'testuser2', '9', '5, July 2017 13:05:00']];
  const table = new Table({
    head: ['Position', 'ID Number', 'Score', 'Time'],
    colWidths: [posColWidth, idColWidth, scoreColWidth, timeColWidth],
  });
  table.push(...formatScore);

  const fakeServer = nock(`https://${host}:${port}`)
    .get('/scoreboard/Lab1');
  const httpOK = 200;
  fakeServer.reply(httpOK, testScores);

  process.argv = ['/usr/local/nodejs/bin/node',
    '/usr/local/nodejs/bin/autolabjs', 'show', 'score', '-l', 'Lab1'];

  controller.start();

  setTimeout(() => {
    stubSpawn.should.be.calledWithExactly('cat /tmp/autolabjs/scoreboard | less -r', {
      stdio: 'inherit',
      shell: true,
    });
    fs.readFileSync('/tmp/autolabjs/scoreboard').toString().should.be.equal(table.toString());
    mocklogger.verify();
    mockStdout.verify();
    done();
  }, testTimeout);
}


// eslint-disable-next-line max-lines-per-function
function testShowScoreStudent(done) {
  const logstub = sandbox.stub(console, 'log');
  const mockStdout = sandbox.mock(process.stdout);
  const mocklogger = sandbox.mock(logger).expects('log').atLeast(1);

  mockStdout.expects('write').atLeast(1);
  const testScores = [
    { id_no: 'testuser1', score: '10', time: '5, July 2017 13:12:00' },
    { id_no: 'testuser2', score: '9', time: '5, July 2017 13:05:00' },
  ];
  const posColWidth = 10;
  const idColWidth = 15;
  const scoreColWidth = 10;
  const timeColWidth = 23;

  const formatScore = [['1', 'testuser1', '10', '5, July 2017 13:12:00']];
  const table = new Table({
    head: ['Position', 'ID Number', 'Score', 'Time'],
    colWidths: [posColWidth, idColWidth, scoreColWidth, timeColWidth],
  });
  table.push(...formatScore);

  const fakeServer = nock(`https://${host}:${port}`)
    .get('/scoreboard/Lab1');
  const httpOK = 200;
  fakeServer.reply(httpOK, testScores);

  process.argv = ['/usr/local/nodejs/bin/node',
    '/usr/local/nodejs/bin/autolabjs', 'show', 'score', '-l', 'Lab1', '-i', 'testuser1'];

  controller.start();

  setTimeout(() => {
    logstub.should.have.been.calledWith(`\n${table.toString()}`);
    mocklogger.verify();
    mockStdout.verify();
    done();
  }, testTimeout);
}

// eslint-disable-next-line max-lines-per-function
function testShowScoreStudentPrompt(done) {
  const logstub = sandbox.stub(console, 'log');
  const mockStdout = sandbox.mock(process.stdout);
  const mocklogger = sandbox.mock(logger).expects('log').atLeast(1);
  const mockInquirer = sandbox.mock(inquirer);

  mockStdout.expects('write').atLeast(1);
  const testScores = [
    { id_no: 'testuser1', score: '10', time: '5, July 2017 13:12:00' },
    { id_no: 'testuser2', score: '9', time: '5, July 2017 13:05:00' },
  ];
  const posColWidth = 10;
  const idColWidth = 15;
  const scoreColWidth = 10;
  const timeColWidth = 23;

  const formatScore = [['1', 'testuser1', '10', '5, July 2017 13:12:00']];
  const table = new Table({
    head: ['Position', 'ID Number', 'Score', 'Time'],
    colWidths: [posColWidth, idColWidth, scoreColWidth, timeColWidth],
  });
  table.push(...formatScore);

  const fakeServer = nock(`https://${host}:${port}`)
    .get('/scoreboard/Lab1');
  const httpOK = 200;
  fakeServer.reply(httpOK, testScores);

  process.argv = ['/usr/local/nodejs/bin/node',
    '/usr/local/nodejs/bin/autolabjs', 'show', 'score'];
  mockInquirer.expects('prompt').resolves({ lab: 'Lab1', id: 'testuser1' });

  controller.start();

  setTimeout(() => {
    logstub.should.have.been.calledWith(`\n${table.toString()}`);
    mocklogger.verify();
    mockStdout.verify();
    done();
  }, testTimeout);
}
// eslint-disable-next-line max-lines-per-function
function testNetworkFailure(done) {
  const mockStdout = sandbox.mock(process.stdout);
  const logstub = sandbox.stub(console, 'log');

  mockStdout.expects('write').atLeast(1);

  process.argv = ['/usr/local/nodejs/bin/node',
    '/usr/local/nodejs/bin/autolabjs', 'show', 'score', '-l', 'Lab1'];

  controller.start();

  setTimeout(() => {
    logstub.should.have.been.calledWith(chalk.red('\nPlease check your network connection'));
    mockStdout.verify();
    done();
  }, testTimeout);
}

function testFsFailure(done) {
  const mockStdout = sandbox.mock(process.stdout);
  const logstub = sandbox.stub(console, 'log');
  const mocklogger = sandbox.mock(logger).expects('log').atLeast(1);
  const mockFs = sandbox.mock(fs).expects('outputFile').throws('No perm');

  mockStdout.expects('write').atLeast(1);
  const testScores = [
    { id_no: 'testuser1', score: '10', time: '5, July 2017 13:12:00' },
    { id_no: 'testuser2', score: '9', time: '5, July 2017 13:05:00' },
  ];

  const fakeServer = nock(`https://${host}:${port}`)
    .get('/scoreboard/Lab1');
  const httpOK = 200;
  fakeServer.reply(httpOK, testScores);

  process.argv = ['/usr/local/nodejs/bin/node',
    '/usr/local/nodejs/bin/autolabjs', 'show', 'score', '-l', 'Lab1'];

  controller.start();

  setTimeout(() => {
    logstub.should.be.calledWith(chalk.red('Can not display scores due to filesystem error. Try again.'));
    mockFs.verify();
    mocklogger.verify();
    mockStdout.verify();
    done();
  }, testTimeout);
}

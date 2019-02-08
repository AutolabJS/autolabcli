/* eslint-disable object-curly-newline */
const _ = require('lodash');
const chai = require('chai');
const chalk = require('chalk');
const childProcess = require('child_process');
const fs = require('fs-extra');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const Table = require('cli-table');
const util = require('util');

const showOutput = require('../../../../../lib/cli/output/show');

chai.use(sinonChai);
chai.should();

const sandbox = sinon.createSandbox();

describe('For show output', function () {
  afterEach(function () {
    sandbox.restore();
  });

  it('should start the spinner when fetching starts', testSpinnerOnShow);
  it('should send expected output on show status', testShowStatus);
  it('should send expected output on show score for a Lab', testShowScoreLab);
  it('should send expected output on show score for a student', testShowScoreStudent);
  it('should display an error message on show score for an invalid Lab', testInvalidLab);
  it('should display error on fs exception on show event', testFsException);
  it('should send expected output on httpFailure event due to network', testHttpError);
  it('should send expected output on httpFailure event due to invalid query', testQueryFailure);
  it('should send expected output on invalid event', testInvalidEvent);
});

function testSpinnerOnShow(done) {
  const mockStdout = sandbox.mock(process.stdout);

  mockStdout.expects('write').atLeast(1);

  showOutput.sendOutput({ name: 'fetching_results' });
  showOutput.sendOutput({ name: 'invalid' });

  mockStdout.verify();
  sandbox.restore();
  done();
}

function testShowStatus(done) {
  const logStub = sandbox.stub(console, 'log');
  const lineBreakLength = 80;
  const testStatus = {
    components: [
      { role: 'execution_node', hostname: 'localhost', port: '8091', status: 'up' },
      { role: 'execution_node', hostname: 'localhost', port: '8092', status: 'up' },
      { role: 'load_balancer', hostname: 'localhost', port: '8081', maxLogLength: '256kb', cmd: 'log', status: 'up' },
    ],
    job_queue_length: 0,
    timestamp: 'Sun Feb 03 2019 04:44:16 GMT+0000 (Coordinated Universal Time)',
  };

  showOutput.sendOutput({
    name: 'status',
    details: {
      status: testStatus,
    },
  });
  logStub.should.have.been.calledWith(`\n${util.inspect(testStatus,
    { compact: true, breakLength: lineBreakLength, colors: true })}`);
  done();
}

function setupTestScores(testScores) {
  const posColWidth = 10;
  const idColWidth = 15;
  const scoreColWidth = 10;
  const timeColWidth = 23;

  const table = new Table({
    head: ['Position', 'ID Number', 'Score', 'Time'],
    colWidths: [posColWidth, idColWidth, scoreColWidth, timeColWidth],
  });
  const scoreboard = _.zipWith(testScores, _.range(1, testScores.length + 1), (score, position) => {
    score.unshift(position);
    return score;
  });
  table.push(...scoreboard);
  return table.toString();
}

async function testShowScoreLab() {
  const mockFs = sandbox.mock(fs);
  const stubSpawn = sandbox.stub(childProcess, 'spawn');
  const file = '/tmp/autolabjs/scoreboard';
  const testScores = [['user1', 5, '14 July, 1989'], ['user2', 9, '14 July, 1989'], ['user3', 10, '14 July, 1989']];

  const scoreboard = setupTestScores(testScores);
  mockFs.expects('outputFile').withExactArgs(file, scoreboard).resolves({});

  await showOutput.sendOutput({
    name: 'score',
    details: {
      scores: [['user1', '5', '14 July, 1989'], ['user2', '9', '14 July, 1989'], ['user3', '10', '14 July, 1989']],
    },
  });


  stubSpawn.should.be.calledWithExactly('cat /tmp/autolabjs/scoreboard | less -r', {
    stdio: 'inherit',
    shell: true,
  });
  mockFs.verify();
}

async function testFsException() {
  const mockFs = sandbox.mock(fs);
  const logStub = sandbox.stub(console, 'log');
  const mockchildProcess = sandbox.mock(childProcess);
  const file = '/tmp/autolabjs/scoreboard';
  const testScores = [['user1', 5, '14 July, 1989'], ['user2', 9, '14 July, 1989'], ['user3', 10, '14 July, 1989']];

  const scoreboard = setupTestScores(testScores);
  mockFs.expects('outputFile').withExactArgs(file, scoreboard).throws();

  await showOutput.sendOutput({
    name: 'score',
    details: {
      scores: [['user1', '5', '14 July, 1989'], ['user2', '9', '14 July, 1989'], ['user3', '10', '14 July, 1989']],
    },
  });


  mockchildProcess.expects('spawn').never();
  logStub.should.have.been.calledWith(chalk.red('Can not display scores due to filesystem error. Try again.'));
  mockFs.verify();
  mockchildProcess.verify();
}

async function testShowScoreStudent() {
  const logStub = sandbox.stub(console, 'log');
  const testScores = [['user1', 5, '14 July, 1989']];

  showOutput.sendOutput({
    name: 'score',
    details: {
      scores: [['user1', '5', '14 July, 1989']],
    },
  });

  const scoreboard = setupTestScores(testScores);

  logStub.should.have.been.calledWith(`\n${scoreboard}`);
}

function testInvalidLab(done) {
  const logStub = sandbox.stub(console, 'log');

  showOutput.sendOutput({ name: 'invalid_lab' });

  logStub.should.have.been.calledWith(chalk.red('\nInvalid Lab'));
  done();
}

function testHttpError(done) {
  const logStub = sandbox.stub(console, 'log');

  showOutput.sendOutput({
    name: 'httpFailure',
    details: {
      code: 4,
    },
  });

  logStub.should.have.been.calledWith(chalk.red('\nPlease check your network connection'));
  done();
}

function testQueryFailure(done) {
  const logStub = sandbox.stub(console, 'log');

  showOutput.sendOutput({
    name: 'httpFailure',
    details: {
      code: 401,
    },
  });

  logStub.should.have.been.calledWith(chalk.red('\nInvalid query'));
  done();
}

function testInvalidEvent(done) {
  const logStub = sandbox.stub(console, 'log');

  showOutput.sendOutput({ name: 'invalid_event' });

  logStub.should.have.been.calledWith(chalk.red('\nInvalid Event'));
  done();
}

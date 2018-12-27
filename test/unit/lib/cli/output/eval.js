const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chalk = require('chalk');
const Table = require('cli-table');

const evalOutput = require('../../../../../lib/cli/output/eval');

const testCaseColWidth = 15;
const statusColWidth = 25;
const scoreColWidth = 15;

chai.use(sinonChai);
chai.should();

const sandbox = sinon.createSandbox();

const mockData = {
  marks: [1, 1],
  comment: ['success', 'success'],
  status: 0,
  log: '',
  penalty: 0,
};

describe('For eval output', function () {
  it('should start the spinner when evaluation starts', testSpinnerOnEval);
  it('should draw table for scores event and display total score', testDrawTableOnScores);
  it('should show penalty score when status is not 0', testPenalityScore);
  it('should display error message for invalid lang', testInvalidLang);
  it('should display error message for invalid request', testInvalidRequest);
  it('should display error message for submission_pending event', testSubmissionPending);
  it('should display error message for invalid event', testInvalidEvent);
});

function testSpinnerOnEval(done) {
  const mockStdout = sandbox.mock(process.stdout);

  mockStdout.expects('write').atLeast(1);

  evalOutput.sendOutput({ name: 'eval_started' });
  evalOutput.sendOutput({ name: 'invalid' });

  mockStdout.verify();
  sandbox.restore();
  done();
}

function testDrawTableOnScores(done) {
  const logStub = sandbox.stub(console, 'log');
  evalOutput.sendOutput({
    name: 'scores',
    details: {
      ...mockData,
    },
  });

  const table = new Table({
    head: [chalk.cyan('Test Case #'), chalk.cyan('Status'), chalk.cyan('Score')],
    colWidths: [testCaseColWidth, statusColWidth, scoreColWidth],
  });
  table.push(
    ['1', 'success', '1'],
    ['2', 'success', '1'],
  );

  logStub.should.have.been.calledWith(chalk.green('\nSubmission successful. Retreiving results'));
  logStub.should.have.been.calledWith(table.toString());
  logStub.should.have.been.calledWith(`\n${chalk.yellow('Log :\n')}${Buffer.from(mockData.log, 'base64').toString()}`);
  logStub.should.have.been.calledWith(`${chalk.yellow('Warning: ')}This lab is not active. The result of this evaluation is not added to the scoreboard.`);
  logStub.should.have.been.calledWith(`${chalk.green('Total Score: ')}2`);

  sandbox.restore();
  done();
}

function testPenalityScore(done) {
  const logStub = sandbox.stub(console, 'log');

  mockData.status = 1;
  evalOutput.sendOutput({
    name: 'scores',
    details: {
      ...mockData,
    },
  });

  logStub.should.have.been.calledWith(chalk.red('Penalty : ') + 0);
  sandbox.restore();
  done();
}

function testInvalidLang(done) {
  const logStub = sandbox.stub(console, 'log');
  evalOutput.sendOutput({
    name: 'invalid_lang',
    details: {
      supportedLanguages: ['java'],
    },
  });

  logStub.should.have.been.calledWith(chalk.red('\nPlease provide the a valid language. The supported languages are java'));
  sandbox.restore();
  done();
}

function testInvalidRequest(done) {
  const logStub = sandbox.stub(console, 'log');
  evalOutput.sendOutput({
    name: 'invalid',
  });

  logStub.should.have.been.calledWith(chalk.red('\nAccess Denied. Please try submitting again'));
  sandbox.restore();
  done();
}

function testSubmissionPending(done) {
  const logStub = sandbox.stub(console, 'log');

  evalOutput.sendOutput({
    name: 'submission_pending',
  });

  logStub.should.have.been.calledWith(chalk.yellow('\nYou have a pending submission. Please try after some time.'));
  sandbox.restore();
  done();
}

function testInvalidEvent(done) {
  const logStub = sandbox.stub(console, 'log');

  evalOutput.sendOutput({
    name: 'invalid_event',
  });

  logStub.should.have.been.calledWith(chalk.red('\nInvalid Event'));
  sandbox.restore();
  done();
}

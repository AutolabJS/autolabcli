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

const testSpinnerOnEval = (done) => {
  const mockStdout = sandbox.mock(process.stdout);

  mockStdout.expects('write').atLeast(1);

  evalOutput.sendOutput({ name: 'eval_started' });
  evalOutput.sendOutput({ name: 'invalid' });

  mockStdout.verify();
  sandbox.restore();
  done();
};

const testDrawTableOnScores = () => {
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
};

const testPenalityScore = () => {
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
};

const testInvalidEvent = () => {
  const logStub = sandbox.stub(console, 'log');
  evalOutput.sendOutput({
    name: 'invalid',
  });

  logStub.should.have.been.calledWith(chalk.red('\nAccess Denied. Please try submitting again'));
  sandbox.restore();
};

const testSubmissionPending = () => {
  const logStub = sandbox.stub(console, 'log');

  evalOutput.sendOutput({
    name: 'submission_pending',
  });

  logStub.should.have.been.calledWith(chalk.yellow('\nYou have a pending submission. Please try after some time.'));
  sandbox.restore();
};

describe('For eval output', () => {
  it('should start the spinner when evaluation starts', testSpinnerOnEval);
  it('should draw table for scores event and display total score', testDrawTableOnScores);
  it('should show penalty score when status is not 0', testPenalityScore);
  it('should display error message for invalid event', testInvalidEvent);
  it('should display error message for submission_pending event', testSubmissionPending);
});

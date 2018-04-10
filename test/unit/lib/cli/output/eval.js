const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chalk = require('chalk');
const Table = require('cli-table');
const path = require('path');

const evalOutput = require('../../../../../lib/cli/output/eval');
const defaultPrefPath = path.join(__dirname, '../../../../../default-prefs.json');
const defaultprefs = JSON.parse(require('fs').readFileSync(defaultPrefPath, 'utf8'));
const {supportedLanguages} = defaultprefs;

chai.use(sinonChai);
chai.should();

describe('For eval output', () => {

  const sandbox = sinon.createSandbox();
  const mockData = {
    marks: [1,1],
    comment: ['success', 'success'],
    status: 0,
    log: '',
    penalty: 0
  }

  it('should start the spinner when evaluation starts', () => {
    const logStub = sandbox.stub(console, 'log');
    const mockStdout = sandbox.mock(process.stdout);

    mockStdout.expects('write').atLeast(1);

    evalOutput.sendOutput({name: 'eval_started'});
    evalOutput.sendOutput({name: 'invalid'});

    mockStdout.verify();

    sandbox.restore();
  });

  it('should draw table for scores event and display total score', () => {
    const logStub = sandbox.stub(console, 'log');

    evalOutput.sendOutput({
      name: 'scores',
      details: {
        ...mockData
      }
    });

    const table = new Table({
      head: [chalk.cyan('Test Case #'), chalk.cyan('Status'), chalk.cyan('Score')],
      colWidths: [15,25,15]
    });
    table.push(
      ['1', 'success', '1'],
      ['2', 'success', '1']
    );

    logStub.should.have.been.calledWith(chalk.green('\nSubmission successful. Retreiving results'));
    logStub.should.have.been.calledWith(table.toString());
    logStub.should.have.been.calledWith('\n' + chalk.yellow('Log :\n') + new Buffer(mockData.log, 'base64').toString());
    logStub.should.have.been.calledWith(chalk.yellow('Warning: ') + 'This lab is not active. The result of this evaluation is not added to the scoreboard.');
    logStub.should.have.been.calledWith(chalk.green('Total Score: ') + '2');

    sandbox.restore();
  });

  it('should show penalty score when status is not 0', () => {
    const logStub = sandbox.stub(console, 'log');
    mockData.status = 1;
    evalOutput.sendOutput({
      name: 'scores',
      details: {
        ...mockData
      }
    });

    logStub.should.have.been.calledWith(chalk.red('Penalty : ') + 0);
    sandbox.restore();
  });

  it('should display error message for invalid event', () => {
    const logStub = sandbox.stub(console, 'log');
    evalOutput.sendOutput({
      name: 'invalid',
    });

    logStub.should.have.been.calledWith(chalk.red('\nAccess Denied. Please try submitting again'));
    sandbox.restore();
  });

  it('should display error message for submission_pending event', () => {
    const logStub = sandbox.stub(console, 'log');
    evalOutput.sendOutput({
      name: 'submission_pending',
    });

    logStub.should.have.been.calledWith(chalk.yellow('\nYou have a pending submission. Please try after some time.'));
    sandbox.restore();
  });

});

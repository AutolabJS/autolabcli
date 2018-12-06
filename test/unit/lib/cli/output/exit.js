const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chalk = require('chalk');

const exitOutput = require('../../../../../lib/cli/output/exit');

chai.use(sinonChai);
chai.should();

const sandbox = sinon.createSandbox();

describe('For exit output', function () {
  it('should send logout message on succesful logout', testSuccessfulLogout);
  it('should display error message for invalid event', testInvalidEvent);
});

function testSuccessfulLogout(done) {
  const logStub = sandbox.stub(console, 'log');
  exitOutput.sendOutput({ name: 'logout_success' });
  logStub.should.have.been.calledWith(chalk.green('Your have been succesfully logged out!'));

  sandbox.restore();
  done();
}

function testInvalidEvent(done) {
  const logStub = sandbox.stub(console, 'log');

  exitOutput.sendOutput({
    name: 'invalid_event',
  });

  logStub.should.have.been.calledWith(chalk.red('\nInvalid Event'));
  sandbox.restore();
  done();
}

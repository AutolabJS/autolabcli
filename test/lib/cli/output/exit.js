const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chalk = require('chalk');

const exitOutput = require('../../../../lib/cli/output/exit');

chai.use(sinonChai);
chai.should();

describe('For init output', () => {

  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  it('should send logout message on succesful logout', () => {
    const logStub = sandbox.stub(console, 'log');
    exitOutput.sendOutput({name: 'logout_success'});
    logStub.should.have.been.calledWith(chalk.green(`Your have been succesfully logged out!`));
  });

});

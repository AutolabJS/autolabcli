const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chalk = require('chalk');
const figlet = require('figlet');

const initOutput = require('../../../../lib/cli/output/init');

chai.use(sinonChai);
chai.should();

describe('For init output', () => {

  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });


  it('should send expected welcome text', () => {
    const logSpy = sandbox.spy(console, 'log');
    const figletStub = sandbox.stub(figlet, 'textSync');
    initOutput.sendWelcome();
    logSpy.should.have.been.called;
    figletStub.should.have.been.deep.calledWith('Autolab CLI', { horizontalLayout: 'full' });
  });

  it('should log out the expected string', () => {
    const logStub = sandbox.stub(console, 'log');
    const outputString = `Your username is: ${chalk.blue('testuser1')}\nYour password is: ${chalk.red('123')}`;
    initOutput.sendResult('testuser1', '123');
    logStub.should.have.been.calledWith(outputString);
  });
});

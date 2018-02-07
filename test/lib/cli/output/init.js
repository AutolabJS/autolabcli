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
    const logStub = sandbox.stub(console, 'log');
    const mockFiglet = sandbox.mock(figlet);

    mockFiglet.expects('textSync').once().withExactArgs('Autolab CLI', { horizontalLayout: 'full' }).
      returns('Autolab CLI');

    initOutput.sendWelcome();
    
    mockFiglet.verify();
    logStub.should.have.been.calledWith(chalk.yellow('Autolab CLI'));
  });

  it('should log out the expected string', () => {
    const logStub = sandbox.stub(console, 'log');
    const outputString = `Your username is: ${chalk.blue('testuser1')}\nYour password is: ${chalk.red('123')}`;
    initOutput.sendResult('testuser1', '123');
    logStub.should.have.been.calledWith(outputString);
  });
});

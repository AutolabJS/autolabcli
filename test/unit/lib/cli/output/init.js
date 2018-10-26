const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chalk = require('chalk');
const figlet = require('figlet');

const initOutput = require('../../../../../lib/cli/output/init');

chai.use(sinonChai);
chai.should();

describe('For init output', () => {
  const sandbox = sinon.createSandbox();


  it('should send expected welcome text', () => {
    const logStub = sandbox.stub(console, 'log');
    const mockFiglet = sandbox.mock(figlet);

    mockFiglet.expects('textSync').once().withExactArgs('AutolabJS   CLI', { horizontalLayout: 'default' })
      .returns('Autolab CLI');

    initOutput.sendOutput({ name: 'welcome' });

    mockFiglet.verify();
    logStub.should.have.been.calledWith(chalk.yellow('Autolab CLI'));

    sandbox.restore();
  });

  it('should start the spinner when authentication starts', () => {
    const mockStdout = sandbox.mock(process.stdout);

    mockStdout.expects('write').atLeast(1);

    initOutput.sendOutput({ name: 'authentication_started' });
    initOutput.sendOutput({ name: 'authentication_ended', details: {} });

    mockStdout.verify();

    sandbox.restore();
  });

  it('should display sucess message  for status code as 200', () => {
    const logStub = sandbox.stub(console, 'log');

    initOutput.sendOutput({
      name: 'authentication_ended',
      details: {
        code: 200,
        name: 'test_user',
      },
    });

    logStub.should.have.been.calledWith(chalk.green('\nHi test_user! You have successfully logged into AutolabJS. Run \'autolabjs help\' for help.'));

    sandbox.restore();
  });

  it('should display error message  for invalid credentials', () => {
    const logStub = sandbox.stub(console, 'log');

    initOutput.sendOutput({
      name: 'authentication_ended',
      details: {
        code: 401,
      },
    });

    logStub.should.have.been.calledWith(chalk.red('\nInvalid Username or Password'));

    sandbox.restore();
  });

  it('should display appropriate error message  for no connection', () => {
    const logStub = sandbox.stub(console, 'log');

    initOutput.sendOutput({
      name: 'authentication_ended',
      details: {
        code: 4,
      },
    });

    logStub.should.have.been.calledWith(chalk.red('\nPlease check your network connection'));

    sandbox.restore();
  });
});

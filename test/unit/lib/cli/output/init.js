const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chalk = require('chalk');
const figlet = require('figlet');

const initOutput = require('../../../../../lib/cli/output/init');

chai.use(sinonChai);
chai.should();

const sandbox = sinon.createSandbox();

const testWelcomeText = () => {
  const logStub = sandbox.stub(console, 'log');
  const mockFiglet = sandbox.mock(figlet);

  mockFiglet.expects('textSync').once().withExactArgs('AutolabJS   CLI', { horizontalLayout: 'default' })
    .returns('Autolab CLI');

  initOutput.sendOutput({ name: 'welcome' });

  mockFiglet.verify();
  logStub.should.have.been.calledWith(chalk.yellow('Autolab CLI'));

  sandbox.restore();
};

const testAuthSpinner = () => {
  const mockStdout = sandbox.mock(process.stdout);

  mockStdout.expects('write').atLeast(1);

  initOutput.sendOutput({ name: 'authentication_started' });
  initOutput.sendOutput({ name: 'authentication_ended', details: {} });

  mockStdout.verify();

  sandbox.restore();
};

const testSucessfulAuth = () => {
  const logStub = sandbox.stub(console, 'log');
  const httpOK = 200;
  initOutput.sendOutput({
    name: 'authentication_ended',
    details: {
      code: httpOK,
      name: 'test_user',
    },
  });

  logStub.should.have.been.calledWith(chalk.green('\nHi test_user! You have successfully logged into AutolabJS. Run \'autolabjs help\' for help.'));

  sandbox.restore();
};

const testInvalidCredentials = () => {
  const logStub = sandbox.stub(console, 'log');
  const httpUnauth = 401;
  initOutput.sendOutput({
    name: 'authentication_ended',
    details: {
      code: httpUnauth,
    },
  });

  logStub.should.have.been.calledWith(chalk.red('\nInvalid Username or Password'));

  sandbox.restore();
};

const testNetworkError = () => {
  const logStub = sandbox.stub(console, 'log');
  const httpFailure = 4;
  initOutput.sendOutput({
    name: 'authentication_ended',
    details: {
      code: httpFailure,
    },
  });

  logStub.should.have.been.calledWith(chalk.red('\nPlease check your network connection'));

  sandbox.restore();
};

const testInvalidEvent = (done) => {
  const logStub = sandbox.stub(console, 'log');

  initOutput.sendOutput({
    name: 'invalid_event',
  });

  logStub.should.have.been.calledWith(chalk.red('\nInvalid Event'));
  sandbox.restore();
  done();
};

describe('For init output', () => {
  it('should send expected welcome text', testWelcomeText);
  it('should start the spinner when authentication starts', testAuthSpinner);
  it('should display sucess message for status code as 200', testSucessfulAuth);
  it('should display error message for invalid credentials', testInvalidCredentials);
  it('should display appropriate error message  for no connection', testNetworkError);
  it('should display error message for invalid event', testInvalidEvent);
});

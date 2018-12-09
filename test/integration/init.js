const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const figlet = require('figlet');
const chalk = require('chalk');
const nock = require('nock');
const inquirer = require('inquirer');
const controller = require('../../lib/controller');
const preferenceManager = require('../../lib/utils/preference-manager');
const { logger } = require('../../lib/utils/logger');

let host = 'autolab.bits-goa.ac.in';
if (preferenceManager.getPreference({ name: 'cliPrefs' }).gitlab) {
  ({ host } = preferenceManager.getPreference({ name: 'cliPrefs' }).gitlab);
}

chai.use(sinonChai);
chai.should();

const sandbox = sinon.createSandbox();

describe('Integration test for init command', function () {
  beforeEach(function () {
    const fakeServer = nock(`https://${host}`)
      .post('/api/v4/session?login=testuser2&password=123');

    const httpOK = 200;

    fakeServer.reply(httpOK, {
      ok: true,
      name: 'test_user2',
      private_token: 'zxcvbnb',
    });
  });

  it('should have output as expected when init command is provided with flags', testInitFlags);
  it('should have output as expected when network fails', testNetworkFailure);
  it('should have output as expected when init command is NOT provided with flags', testInitNoFlags);
});

async function testInitFlags() {
  const logstub = sandbox.stub(console, 'log');
  const mocklogger = sandbox.mock(logger).expects('log').atLeast(1);
  process.argv = ['/usr/local/nodejs/bin/node',
    '/usr/local/nodejs/bin/autolabjs', 'init', '-u', 'testuser2', '-p', '123'];

  await controller.start();
  const outputString = chalk.yellow(figlet.textSync('AutolabJS   CLI', { horizontalLayout: 'default' }));
  logstub.should.have.been.calledWith(outputString);
  logstub.should.to.have.been.calledWith(chalk.green('\nHi test_user2! You have successfully logged into AutolabJS. Run \'autolabjs help\' for help.'));
  preferenceManager.getPreference({ name: 'gitLabPrefs' }).privateToken.should.equal('zxcvbnb');
  mocklogger.verify();
  sandbox.restore();
}

async function testNetworkFailure() {
  const faultServer = nock(`https://${host}`)
    .post('/api/v4/session?login=testuser3&password=123');

  const httpFailure = 4;
  faultServer.reply(httpFailure, { });

  const logstub = sandbox.stub(console, 'log');
  const mocklogger = sandbox.mock(logger).expects('log').atLeast(1);
  process.argv = ['/usr/local/nodejs/bin/node',
    '/usr/local/nodejs/bin/autolabjs', 'init', '-u', 'testuser3', '-p', '123'];

  await controller.start();
  const outputString = chalk.yellow(figlet.textSync('AutolabJS   CLI', { horizontalLayout: 'default' }));
  logstub.should.have.been.calledWith(outputString);
  logstub.should.to.have.been.calledWith(chalk.red('\nPlease check your network connection'));
  mocklogger.verify();
  sandbox.restore();
}

async function testInitNoFlags() {
  const logstub = sandbox.stub(console, 'log');
  const mocklogger = sandbox.mock(logger).expects('log').atLeast(1);
  process.argv = ['/usr/local/nodejs/bin/node',
    '/usr/local/nodejs/bin/autolabjs', 'init'];
  const mockInquirer = sandbox.mock(inquirer);
  mockInquirer.expects('prompt').resolves({ username: 'testuser2', password: '123' });

  await controller.start();
  const outputString = chalk.yellow(figlet.textSync('AutolabJS   CLI', { horizontalLayout: 'default' }));
  logstub.should.have.been.calledWith(outputString);
  logstub.should.to.have.been.calledWith(chalk.green('\nHi test_user2! You have successfully logged into AutolabJS. Run \'autolabjs help\' for help.'));
  preferenceManager.getPreference({ name: 'gitLabPrefs' }).privateToken.should.equal('zxcvbnb');
  mockInquirer.verify();
  mocklogger.verify();
  sandbox.restore();
}

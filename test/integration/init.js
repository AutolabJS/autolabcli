const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const { exec } = require('child_process');
const path = require('path');
const figlet = require('figlet');
const chalk = require('chalk');
const nock = require('nock');
const inquirer = require('inquirer');
const controller = require('../../lib/controller');
const preferenceManager = require('../../lib/utils/preference-manager');

chai.use(sinonChai);
chai.should();

describe('Integration test for init command', () => {
  const sandbox = sinon.createSandbox();
  beforeEach(() => {
    const fakeServer = nock('https://autolab.bits-goa.ac.in')
      .post('/api/v4/session?login=testuser2&password=123');
    fakeServer.reply(200, {
      ok: true,
      name: 'test_user2',
      private_token: 'zxcvbnb',
    });
  });

  it('should have output as expected when init command is provided with flags', async () => {
    const logstub = sandbox.stub(console, 'log');
    process.argv = ['/usr/local/nodejs/bin/node',
      '/usr/local/nodejs/bin/autolab', 'init', '-u', 'testuser2', '-p', '123'];

    await controller.start();
    const outputString = chalk.yellow(figlet.textSync('AutolabJS   CLI', { horizontalLayout: 'default' }));
    logstub.should.have.been.calledWith(outputString);
    logstub.should.to.have.been.calledWith(chalk.green('\nHi test_user2! You have successfully logged into AutolabJS. Run \'autolabjs help\' for help.'));
    preferenceManager.getPreference({ name: 'gitLabPrefs' }).privateToken.should.equal('zxcvbnb');
    sandbox.restore();
  });

  it('should have output as expected when init command is NOT provided with flags', async () => {
    const logstub = sandbox.stub(console, 'log');
    process.argv = ['/usr/local/nodejs/bin/node',
      '/usr/local/nodejs/bin/autolab', 'init'];
    const mockInquirer = sandbox.mock(inquirer);
    mockInquirer.expects('prompt').resolves({ username: 'testuser2', password: '123' });

    await controller.start();
    const outputString = chalk.yellow(figlet.textSync('AutolabJS   CLI', { horizontalLayout: 'default' }));
    logstub.should.have.been.calledWith(outputString);
    logstub.should.to.have.been.calledWith(chalk.green('\nHi test_user2! You have successfully logged into AutolabJS. Run \'autolabjs help\' for help.'));
    preferenceManager.getPreference({ name: 'gitLabPrefs' }).privateToken.should.equal('zxcvbnb');
    mockInquirer.verify();
    sandbox.restore();
  });
});

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
      private_token: 'zxcvbnb'
    });
  });


  afterEach(() => {
    sandbox.restore();
  });

  it('should have ouptput as expected when init command is provided with flags', (done) => {

    const logSpy = sandbox.stub(console, 'log');
    process.argv = [ '/usr/local/nodejs/bin/node',
      '/usr/local/nodejs/bin/autolab', 'init', '-u', 'testuser2', '-p', '123' ];

    controller.start();
    setTimeout(() => {
      let outputString = chalk.yellow(figlet.textSync('AutolabJS   CLI', { horizontalLayout: 'default' }));
      logSpy.should.have.been.calledWith(outputString);
      logSpy.should.to.have.been.calledWith(chalk.green('\nHi test_user2! Proceed to making commits in this repository. Run \'autolabjs help\' for help.'));
      preferenceManager.getPreference({name: 'gitLabPrefs'}).privateToken.should.equal('zxcvbnb');
      done();
    },100);
  });

  it('should have ouptput as expected when init command is NOT provided with flags', (done) => {
    const logSpy = sandbox.stub(console, 'log');
    process.argv = [ '/usr/local/nodejs/bin/node',
      '/usr/local/nodejs/bin/autolab', 'init' ];
    const mockInquirer = sandbox.mock(inquirer);
    mockInquirer.expects('prompt').returns(Promise.resolve({username: 'testuser2', password: '123'}));

    controller.start();
    setTimeout(() => {
      let outputString = chalk.yellow(figlet.textSync('AutolabJS   CLI', { horizontalLayout: 'default' }));
      logSpy.should.have.been.calledWith(outputString);
      logSpy.should.to.have.been.calledWith(chalk.green('\nHi test_user2! Proceed to making commits in this repository. Run \'autolabjs help\' for help.'));
      preferenceManager.getPreference({name: 'gitLabPrefs'}).privateToken.should.equal('zxcvbnb');
      mockInquirer.verify();
      done();
    },100);

  });

});

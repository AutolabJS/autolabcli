const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chalk = require('chalk');
const inquirer = require('inquirer');
const Table = require('cli-table');
const controller = require('../../lib/controller');
const preferenceManager = require('../../lib/utils/preference-manager');

chai.use(sinonChai);
chai.should();

describe('Integration test for init command', () => {

  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  it('should be able to change the language', (done) => {
    const logSpy = sandbox.stub(console, 'log');
    process.argv = [ '/usr/local/nodejs/bin/node',
      '/usr/local/nodejs/bin/autolab', 'prefs', 'changelang'];
    const mockInquirer = sandbox.mock(inquirer);
    mockInquirer.expects('prompt').returns(Promise.resolve({lang: 'python3'}));

    controller.start();
    setTimeout(() => {
      preferenceManager.getPreference({name: 'cliPrefs'}).submission.language.should.equal('python3');
      logSpy.should.have.been.calledWith(chalk.green(`Your submission language has been chaged to python3`));
      mockInquirer.verify();
      done();
    }, 0);

  });

  it('should be able to change the main server', (done) => {
    const logSpy = sandbox.stub(console, 'log');
    process.argv = [ '/usr/local/nodejs/bin/node',
      '/usr/local/nodejs/bin/autolab', 'prefs', 'changeserver',
      '--url', 'xyz', '--port', '9090'];

    controller.start();
    setTimeout(() => {
      preferenceManager.getPreference({name: 'cliPrefs'}).main_server.should.deep.equal({
        host: 'xyz',
        port: '9090'
      });
      logSpy.should.have.been.calledWith(chalk.green(`Your submission server has been chaged to xyz at port 9090`));
      done();
    }, 0);

  });

  it('should be able to change the main server', (done) => {
    const logSpy = sandbox.stub(console, 'log');
    const table = new Table({
        head: [chalk.cyan('Preferences'), chalk.cyan('Values')]
      , colWidths: [15, 25]
    });
    table.push(
      ['Language', 'python3'],
      ['Server url', 'xyz'],
      ['Server port', 9090]
    );
    process.argv = [ '/usr/local/nodejs/bin/node',
      '/usr/local/nodejs/bin/autolab', 'prefs', 'show'];

    controller.start();
    setTimeout(() => {
      logSpy.should.have.been.calledWith(table.toString());
      done();
    }, 0);

  });

});

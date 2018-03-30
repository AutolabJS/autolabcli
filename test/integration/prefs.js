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

describe('Integration test for prefs command', () => {
  const sandbox = sinon.createSandbox();

  it('should be able to change the language', async () => {
    const logSpy = sandbox.stub(console, 'log');
    process.argv = ['/usr/local/nodejs/bin/node',
      '/usr/local/nodejs/bin/autolab', 'prefs', 'changelang'];
    const mockInquirer = sandbox.mock(inquirer);
    mockInquirer.expects('prompt').resolves({ lang: 'python3' });

    await controller.start();
    preferenceManager.getPreference({ name: 'cliPrefs' }).submission.language.should.equal('python3');
    logSpy.should.have.been.calledWith(chalk.green('Your submission language has been changed to python3'));
    mockInquirer.verify();
    sandbox.restore();
  });

  it('should be able to change the main server', async () => {
    const logSpy = sandbox.stub(console, 'log');
    process.argv = ['/usr/local/nodejs/bin/node',
      '/usr/local/nodejs/bin/autolab', 'prefs', 'changeserver',
      '--host', 'xyz.com', '--port', '9090'];

    await controller.start();
    preferenceManager.getPreference({ name: 'cliPrefs' }).main_server.should.deep.equal({
      host: 'xyz.com',
      port: '9090',
    });
    logSpy.should.have.been.calledWith(chalk.green('Your submission server has been changed to xyz.com at port 9090'));
    sandbox.restore();
  });

  it('should be able to change the main server', async () => {
    const logSpy = sandbox.stub(console, 'log');
    const table = new Table({
      head: [chalk.cyan('Preferences'), chalk.cyan('Values')],
      colWidths: [15, 25],
    });
    table.push(
      ['Language', 'python3'],
      ['Server host', 'xyz.com'],
      ['Server port', 9090],
    );
    process.argv = ['/usr/local/nodejs/bin/node',
      '/usr/local/nodejs/bin/autolab', 'prefs', 'show'];

    await controller.start();
    logSpy.should.have.been.calledWith(table.toString());
    sandbox.restore();
  });
});

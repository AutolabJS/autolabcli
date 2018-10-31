const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chalk = require('chalk');
const inquirer = require('inquirer');
const Table = require('cli-table');
const path = require('path');
const fs = require('fs');
const controller = require('../../lib/controller');
const preferenceManager = require('../../lib/utils/preference-manager');
const { logger } = require('../../lib/utils/logger');

const defaultPrefPath = path.join(__dirname, '../../default-prefs.json');
const defaultPrefs = JSON.parse(fs.readFileSync(defaultPrefPath, 'utf8'));

const { supportedLanguages } = defaultPrefs;

chai.use(sinonChai);
chai.should();

describe('Integration test for prefs command', () => {
  const sandbox = sinon.createSandbox();

  before(() => {
    logger.transports.forEach((t) => { t.silent = true; }); // eslint-disable-line no-param-reassign
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should be able to change the language', async () => {
    const logSpy = sandbox.stub(console, 'log');
    process.argv = ['/usr/local/nodejs/bin/node',
      '/usr/local/nodejs/bin/autolabjs', 'prefs', 'changelang'];
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
      '/usr/local/nodejs/bin/autolabjs', 'prefs', 'changeserver',
      '--type', 'ms', '--host', 'xyz.com', '--port', '9090'];

    await controller.start();
    preferenceManager.getPreference({ name: 'cliPrefs' }).main_server.should.deep.equal({
      host: 'xyz.com',
      port: '9090',
    });
    logSpy.should.have.been.calledWith(chalk.green('Your main server has been changed to xyz.com at port 9090'));
    sandbox.restore();
  });

  it('should be able to change the gitlab server', async () => {
    const logSpy = sandbox.stub(console, 'log');
    process.argv = ['/usr/local/nodejs/bin/node',
      '/usr/local/nodejs/bin/autolabjs', 'prefs', 'changeserver',
      '--host', 'abc.com'];
    const mockInquirer = sandbox.mock(inquirer);
    mockInquirer.expects('prompt').resolves({ type: 'gitlab' });

    await controller.start();
    preferenceManager.getPreference({ name: 'cliPrefs' }).gitlab.should.deep.equal({
      host: 'abc.com',
    });
    logSpy.should.have.been.calledWith(chalk.green('Your gitlab server has been changed to abc.com'));
    sandbox.restore();
  });

  it('should be able to change the logger file size', async () => {
    const logSpy = sandbox.stub(console, 'log');
    const testSize = 786770;
    const testOutput = {
      maxSize: testSize,
      logDirectory: '.autolabjs',
      logLocation: 'cli.log',
      blacklist: ['log', 'password', 'privateToken'],
    };
    process.argv = ['/usr/local/nodejs/bin/node',
      '/usr/local/nodejs/bin/autolabjs', 'prefs', 'logger',
      '--maxsize', testSize.toString()];

    await controller.start();
    preferenceManager.getPreference({ name: 'cliPrefs' }).logger.should.deep.equal(testOutput);
    logSpy.should.have.been.calledWith(chalk.green('Your logger preferences have been updated.'));
    sandbox.restore();
  });

  it('should be able to add to logger blacklist', async () => {
    const logSpy = sandbox.stub(console, 'log');
    const testSize = 786770;
    const testOutput = {
      maxSize: testSize,
      logDirectory: '.autolabjs',
      logLocation: 'cli.log',
      blacklist: ['log', 'password', 'privateToken', 'usrname'],
    };
    process.argv = ['/usr/local/nodejs/bin/node',
      '/usr/local/nodejs/bin/autolabjs', 'prefs', 'logger',
      '--blacklist', 'usrname'];

    await controller.start();
    preferenceManager.getPreference({ name: 'cliPrefs' }).logger.should.deep.equal(testOutput);
    logSpy.should.have.been.calledWith(chalk.green('Your logger preferences have been updated.'));
    sandbox.restore();
  });

  it('should show the prefs', async () => {
    const logSpy = sandbox.stub(console, 'log');

    const prefsColWidth = 25;
    const valuesColWidth = 27;

    const table = new Table({
      head: [chalk.cyan('Preferences'), chalk.cyan('Values')],
      colWidths: [prefsColWidth, valuesColWidth],
    });

    const testMSPort = 9090;
    const testSize = 786770;

    table.push(
      ['Gitlab host', 'abc.com'],
      ['Main Server host', 'xyz.com'],
      ['Main Server port', testMSPort],
      ['Logger file MaxSize', testSize],
      ['Log file Directory', '.autolabjs'],
      ['Log file name', 'cli.log'],
      ['Logger blacklist keys', ['log', 'password', 'privateToken', 'usrname']],
    );
    process.argv = ['/usr/local/nodejs/bin/node',
      '/usr/local/nodejs/bin/autolabjs', 'prefs', 'show'];

    await controller.start();
    logSpy.should.have.been.calledWith(table.toString());
    sandbox.restore();
  });

  it('should display error message for invalid host', async () => {
    const logSpy = sandbox.stub(console, 'log');
    process.argv = ['/usr/local/nodejs/bin/node',
      '/usr/local/nodejs/bin/autolabjs', 'prefs', 'changeserver',
      '--type', 'ms', '--host', 'xyz', '--port', '9090'];

    await controller.start();
    logSpy.should.have.been.calledWith(chalk.red('Please provide a valid host'));
    sandbox.restore();
  });

  it('should display error message for invalid port', async () => {
    const logSpy = sandbox.stub(console, 'log');
    process.argv = ['/usr/local/nodejs/bin/node',
      '/usr/local/nodejs/bin/autolabjs', 'prefs', 'changeserver',
      '--type', 'ms', '--host', 'xyz.com', '--port', '909A'];

    await controller.start();
    logSpy.should.have.been.calledWith(chalk.red('Please provide a valid port'));
    sandbox.restore();
  });

  it('should display error message for invalid lang', async () => {
    const logSpy = sandbox.stub(console, 'log');
    process.argv = ['/usr/local/nodejs/bin/node',
      '/usr/local/nodejs/bin/autolabjs', 'prefs', 'changelang',
      '--lang', 'cpp15'];

    await controller.start();
    logSpy.should.have.been.calledWith(chalk.red(`Please provide the a valid language. The supported languages are ${supportedLanguages}`));
    sandbox.restore();
  });

  it('should display error message for invalid keyword', async () => {
    const logSpy = sandbox.stub(console, 'log');
    process.argv = ['/usr/local/nodejs/bin/node',
      '/usr/local/nodejs/bin/autolabjs', 'prefs', 'logger',
      '--blacklist', 'usrname'];

    await controller.start();
    logSpy.should.have.been.calledWith(chalk.red('Keyword already exixts, please provide valid blacklist keyword'));
    sandbox.restore();
  });

  it('should change lang using flags', async () => {
    const logSpy = sandbox.stub(console, 'log');
    process.argv = ['/usr/local/nodejs/bin/node',
      '/usr/local/nodejs/bin/autolabjs', 'prefs', 'changelang',
      '--lang', 'cpp14'];

    await controller.start();
    logSpy.should.have.been.calledWith(chalk.green('Your submission language has been changed to cpp14'));
    sandbox.restore();
  });

  it('should be able to change the gitlab server using prompt', async () => {
    const logSpy = sandbox.stub(console, 'log');
    process.argv = ['/usr/local/nodejs/bin/node',
      '/usr/local/nodejs/bin/autolabjs', 'prefs', 'changeserver', '--type', 'gitlab'];
    const mockInquirer = sandbox.mock(inquirer);
    mockInquirer.expects('prompt').resolves({ host: 'abc.com' });

    await controller.start();
    logSpy.should.have.been.calledWith(chalk.green('Your gitlab server has been changed to abc.com'));
    mockInquirer.verify();
    sandbox.restore();
  });

  it('should be able to change the main server using prompt', async () => {
    const logSpy = sandbox.stub(console, 'log');
    process.argv = ['/usr/local/nodejs/bin/node',
      '/usr/local/nodejs/bin/autolabjs', 'prefs', 'changeserver', '--type', 'ms'];
    const mockInquirer = sandbox.mock(inquirer);
    const testPort = 5687;
    mockInquirer.expects('prompt').resolves({ host: 'abc.com', port: testPort });

    await controller.start();
    logSpy.should.have.been.calledWith(chalk.green('Your main server has been changed to abc.com at port 5687'));
    mockInquirer.verify();
    sandbox.restore();
  });

  it('should be able to add to logger blacklist using prompt', async () => {
    const logSpy = sandbox.stub(console, 'log');
    process.argv = ['/usr/local/nodejs/bin/node',
      '/usr/local/nodejs/bin/autolabjs', 'prefs', 'logger'];

    const mockInquirer = sandbox.stub(inquirer, 'prompt');
    mockInquirer.onCall(0).returns({ type: 'blacklist' });
    mockInquirer.onCall(1).returns({ keyword: 'abc' });

    await controller.start();
    logSpy.should.have.been.calledWith(chalk.green('Your logger preferences have been updated.'));
    sandbox.restore();
  });
  it('should be able to add to log file size using prompt', async () => {
    const logSpy = sandbox.stub(console, 'log');
    const testSize = 797291;
    process.argv = ['/usr/local/nodejs/bin/node',
      '/usr/local/nodejs/bin/autolabjs', 'prefs', 'logger'];

    const mockInquirer = sandbox.stub(inquirer, 'prompt');
    mockInquirer.onCall(0).returns({ type: 'maxsize' });
    mockInquirer.onCall(1).returns({ maxSize: testSize.toString() });

    await controller.start();
    logSpy.should.have.been.calledWith(chalk.green('Your logger preferences have been updated.'));
    sandbox.restore();
  });
});

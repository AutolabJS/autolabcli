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
const { submission } = defaultPrefs;
// eslint-disable-next-line camelcase
const { main_server } = defaultPrefs;
const { gitlab } = defaultPrefs;
const defaultLogger = defaultPrefs.logger;


chai.use(sinonChai);
chai.should();

const sandbox = sinon.createSandbox();

// eslint-disable-next-line max-lines-per-function
describe('Integration test for prefs command', function () {
  after(setPrefsDefaults);

  beforeEach(setPrefsDefaults);

  afterEach(function () {
    sandbox.restore();
  });

  it('should be able to change the language', testChangeLang);
  it('should be able to change the main server', testChangeMS);
  it('should be able to change the gitlab server', testChangeGitlab);
  it('should be able to change the logger file size', testChangeLoggerFileSize);
  it('should be able to add to logger blacklist', testChangeLoggerBlacklist);
  it('should show the prefs', testShowPrefs);
  it('should display error message for invalid host', testInvalidHost);
  it('should display error message for invalid port', testInvalidPort);
  it('should display error message for invalid server', testInvalidServer);
  it('should display error message for invalid lang', testInvalidLang);
  it('should display error message for invalid keyword', testInvalidKeyword);
  it('should change lang using flags', testChangeLangFlags);
  it('should be able to change the gitlab server using prompt', testChangeGitlabPrompt);
  it('should be able to change the main server using prompt', testChangeMSPrompt);
  it('should be able to add to logger blacklist using prompt', testChangeLoggerBlacklistPrompt);
  it('should be able to add to log file size using prompt', testChangeLoggerFileSizePrompt);
  it('should display error message for invalid command', testInvalidCommand);
});

function setPrefsDefaults() {
  preferenceManager.setPreference({
    name: 'cliPrefs',
    values: {
      main_server,
      submission,
      logger: { ...defaultLogger },
      gitlab,
    },
  });
  preferenceManager.deleteCredentials();
}

async function testChangeLang() {
  const logSpy = sandbox.stub(console, 'log');
  const mocklogger = sandbox.mock(logger).expects('log').atLeast(1);
  process.argv = ['/usr/local/nodejs/bin/node',
    '/usr/local/nodejs/bin/autolabjs', 'prefs', 'changelang'];
  const mockInquirer = sandbox.mock(inquirer);
  mockInquirer.expects('prompt').resolves({ lang: 'python3' });

  await controller.start();
  preferenceManager.getPreference({ name: 'cliPrefs' }).submission.language.should.equal('python3');
  logSpy.should.have.been.calledWith(chalk.green('Your submission language has been changed to python3'));
  mockInquirer.verify();
  mocklogger.verify();
  sandbox.restore();
}

async function testChangeMS() {
  const logSpy = sandbox.stub(console, 'log');
  const mocklogger = sandbox.mock(logger).expects('log').atLeast(1);
  process.argv = ['/usr/local/nodejs/bin/node',
    '/usr/local/nodejs/bin/autolabjs', 'prefs', 'changeserver',
    '--type', 'ms', '--host', 'xyz.com', '--port', '9090'];

  await controller.start();
  preferenceManager.getPreference({ name: 'cliPrefs' }).main_server.should.deep.equal({
    host: 'xyz.com',
    port: '9090',
  });
  logSpy.should.have.been.calledWith(chalk.green('Your main server has been changed to xyz.com at port 9090'));
  mocklogger.verify();
  sandbox.restore();
}

async function testChangeGitlab() {
  const logSpy = sandbox.stub(console, 'log');
  const mocklogger = sandbox.mock(logger).expects('log').atLeast(1);
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
  mocklogger.verify();
  sandbox.restore();
}

async function testChangeLoggerFileSize() {
  const logSpy = sandbox.stub(console, 'log');
  const mocklogger = sandbox.mock(logger).expects('log').atLeast(1);

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
  mocklogger.verify();
  sandbox.restore();
}

async function testChangeLoggerBlacklist() {
  const logSpy = sandbox.stub(console, 'log');
  const mocklogger = sandbox.mock(logger).expects('log').atLeast(1);

  process.argv = ['/usr/local/nodejs/bin/node',
    '/usr/local/nodejs/bin/autolabjs', 'prefs', 'logger',
    '--blacklist', 'usrname'];

  await controller.start();
  preferenceManager.getPreference({ name: 'cliPrefs' }).logger.blacklist.should.include('usrname');
  logSpy.should.have.been.calledWith(chalk.green('Your logger preferences have been updated.'));
  mocklogger.verify();
  sandbox.restore();
}

// eslint-disable-next-line max-lines-per-function
async function testShowPrefs() {
  const logSpy = sandbox.stub(console, 'log');
  const mocklogger = sandbox.mock(logger).expects('log').atLeast(1);

  const prefsColWidth = 25;
  const valuesColWidth = 27;

  const table = new Table({
    head: [chalk.cyan('Preferences'), chalk.cyan('Values')],
    colWidths: [prefsColWidth, valuesColWidth],
  });

  table.push(
    ['Gitlab host', gitlab.host],
    ['Main Server host', main_server.host],
    ['Main Server port', main_server.port],
    ['Logger file MaxSize', defaultLogger.maxSize],
    ['Log file Directory', defaultLogger.logDirectory],
    ['Log file name', defaultLogger.logLocation],
    ['Logger blacklist keys', defaultLogger.blacklist],
  );
  process.argv = ['/usr/local/nodejs/bin/node',
    '/usr/local/nodejs/bin/autolabjs', 'prefs', 'show'];

  await controller.start();
  logSpy.should.have.been.calledWith(table.toString());
  mocklogger.verify();
  sandbox.restore();
}

async function testInvalidHost() {
  const logSpy = sandbox.stub(console, 'log');
  const mocklogger = sandbox.mock(logger).expects('log').atLeast(1);
  process.argv = ['/usr/local/nodejs/bin/node',
    '/usr/local/nodejs/bin/autolabjs', 'prefs', 'changeserver',
    '--type', 'ms', '--host', 'xyz', '--port', '9090'];

  await controller.start();
  logSpy.should.have.been.calledWith(chalk.red('Please provide a valid host'));
  mocklogger.verify();
  sandbox.restore();
}

async function testInvalidPort() {
  const logSpy = sandbox.stub(console, 'log');
  const mocklogger = sandbox.mock(logger).expects('log').atLeast(1);
  process.argv = ['/usr/local/nodejs/bin/node',
    '/usr/local/nodejs/bin/autolabjs', 'prefs', 'changeserver',
    '--type', 'ms', '--host', 'xyz.com', '--port', '909A'];

  await controller.start();
  logSpy.should.have.been.calledWith(chalk.red('Please provide a valid port'));
  mocklogger.verify();
  sandbox.restore();
}

async function testInvalidServer() {
  const logSpy = sandbox.stub(console, 'log');
  const mocklogger = sandbox.mock(logger).expects('log').atLeast(1);
  process.argv = ['/usr/local/nodejs/bin/node',
    '/usr/local/nodejs/bin/autolabjs', 'prefs', 'changeserver', '--type', 'github'];

  const supportedServers = ['ms', 'gitlab'];

  await controller.start();
  logSpy.should.have.been.calledWith(chalk.red(`Please provide a valid server for config. The valid servers are ${supportedServers}`));
  mocklogger.verify();
  sandbox.restore();
}

async function testInvalidLang() {
  const logSpy = sandbox.stub(console, 'log');
  const mocklogger = sandbox.mock(logger).expects('log').atLeast(1);
  process.argv = ['/usr/local/nodejs/bin/node',
    '/usr/local/nodejs/bin/autolabjs', 'prefs', 'changelang',
    '--lang', 'cpp15'];

  await controller.start();
  logSpy.should.have.been.calledWith(chalk.red(`Please provide the a valid language. The supported languages are ${supportedLanguages}`));
  mocklogger.verify();
  sandbox.restore();
}

async function testInvalidKeyword() {
  const logSpy = sandbox.stub(console, 'log');
  const mocklogger = sandbox.mock(logger).expects('log').atLeast(1);
  process.argv = ['/usr/local/nodejs/bin/node',
    '/usr/local/nodejs/bin/autolabjs', 'prefs', 'logger',
    '--blacklist', 'usrname'];

  await controller.start();
  logSpy.should.have.been.calledWith(chalk.red('Keyword already exixts, please provide valid blacklist keyword'));
  mocklogger.verify();
  sandbox.restore();
}

async function testChangeLangFlags() {
  const logSpy = sandbox.stub(console, 'log');
  const mocklogger = sandbox.mock(logger).expects('log').atLeast(1);
  process.argv = ['/usr/local/nodejs/bin/node',
    '/usr/local/nodejs/bin/autolabjs', 'prefs', 'changelang',
    '--lang', 'cpp14'];

  await controller.start();
  logSpy.should.have.been.calledWith(chalk.green('Your submission language has been changed to cpp14'));
  mocklogger.verify();
  sandbox.restore();
}

async function testChangeGitlabPrompt() {
  const logSpy = sandbox.stub(console, 'log');
  const mocklogger = sandbox.mock(logger).expects('log').atLeast(1);
  process.argv = ['/usr/local/nodejs/bin/node',
    '/usr/local/nodejs/bin/autolabjs', 'prefs', 'changeserver', '--type', 'gitlab'];
  const mockInquirer = sandbox.mock(inquirer);
  mockInquirer.expects('prompt').resolves({ host: 'abc.com' });

  await controller.start();
  logSpy.should.have.been.calledWith(chalk.green('Your gitlab server has been changed to abc.com'));
  mockInquirer.verify();
  mocklogger.verify();
  sandbox.restore();
}

async function testChangeMSPrompt() {
  const logSpy = sandbox.stub(console, 'log');
  const mocklogger = sandbox.mock(logger).expects('log').atLeast(1);
  process.argv = ['/usr/local/nodejs/bin/node',
    '/usr/local/nodejs/bin/autolabjs', 'prefs', 'changeserver', '--type', 'ms'];
  const mockInquirer = sandbox.mock(inquirer);
  const testPort = 5687;
  mockInquirer.expects('prompt').resolves({ host: 'abc.com', port: testPort });

  await controller.start();
  logSpy.should.have.been.calledWith(chalk.green('Your main server has been changed to abc.com at port 5687'));
  mockInquirer.verify();
  mocklogger.verify();
  sandbox.restore();
}

async function testChangeLoggerBlacklistPrompt() {
  const logSpy = sandbox.stub(console, 'log');
  const mocklogger = sandbox.mock(logger).expects('log').atLeast(1);
  process.argv = ['/usr/local/nodejs/bin/node',
    '/usr/local/nodejs/bin/autolabjs', 'prefs', 'logger'];

  const mockInquirer = sandbox.stub(inquirer, 'prompt');
  mockInquirer.onCall(0).returns({ type: 'blacklist' });
  mockInquirer.onCall(1).returns({ keyword: 'abc' });

  await controller.start();
  logSpy.should.have.been.calledWith(chalk.green('Your logger preferences have been updated.'));
  mocklogger.verify();
  sandbox.restore();
}

async function testChangeLoggerFileSizePrompt() {
  const logSpy = sandbox.stub(console, 'log');
  const mocklogger = sandbox.mock(logger).expects('log').atLeast(1);
  const testSize = 797291;
  process.argv = ['/usr/local/nodejs/bin/node',
    '/usr/local/nodejs/bin/autolabjs', 'prefs', 'logger'];

  const mockInquirer = sandbox.stub(inquirer, 'prompt');
  mockInquirer.onCall(0).returns({ type: 'maxsize' });
  mockInquirer.onCall(1).returns({ maxSize: testSize.toString() });

  await controller.start();
  logSpy.should.have.been.calledWith(chalk.green('Your logger preferences have been updated.'));
  mocklogger.verify();
  sandbox.restore();
}

async function testInvalidCommand() {
  const logSpy = sandbox.stub(console, 'log');
  const mocklogger = sandbox.mock(logger).expects('log').atLeast(1);
  process.argv = ['/usr/local/nodejs/bin/node',
    '/usr/local/nodejs/bin/autolabjs', 'prefs', 'changeall'];

  await controller.start();
  logSpy.should.have.been.calledWith(chalk.red('Please provide a valid command'));
  mocklogger.verify();
  sandbox.restore();
}

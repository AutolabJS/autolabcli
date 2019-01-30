const {
  When, Then,
} = require('cucumber');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const chalk = require('chalk');
const Table = require('cli-table');
const fs = require('fs-extra');
const path = require('path');
const controller = require('../../../lib/controller');
const preferenceManager = require('../../../lib/utils/preference-manager');
const PromptGenerator = require('../../../lib/utils/PromptGenerator');

const defaultPrefPath = path.join(__dirname, '../../../default-prefs.json');
const defaultPrefs = JSON.parse(fs.readFileSync(defaultPrefPath, 'utf8'));

const { supportedLanguages } = defaultPrefs;

chai.use(sinonChai);
chai.should();

// The Before and the After hooks run before/after each scenario are present in te hook.js file

When('I run prefs command with changelang using {string}', async function (inputType) {
  process.argv = ['/usr/local/nodejs/bin/node',
    '/usr/local/nodejs/bin/autolabjs', 'prefs', 'changelang'];

  if (inputType === 'flags') {
    process.argv = process.argv.concat(['--lang', 'cpp14']);
  } else if (inputType === 'prompt') {
    this.promptStub.resolves({ lang: 'cpp14' });
  }

  await controller.start();
});

When('I run prefs command with changeserver using {string} for {string}', async function (inputType, serverType) {
  process.argv = ['/usr/local/nodejs/bin/node',
    '/usr/local/nodejs/bin/autolabjs', 'prefs', 'changeserver'];
  if (inputType === 'prompt') {
    const typePromptGenerator = new PromptGenerator();
    typePromptGenerator.addProperty('name', 'type');
    typePromptGenerator.addProperty('type', 'list');
    typePromptGenerator.addProperty('message', 'Choose the server type:');
    typePromptGenerator.addProperty('choices', ['gitlab', 'ms']);
    typePromptGenerator.addProperty('validate', undefined);
    const typePrompt = typePromptGenerator.getPrompt();
    this.promptStub.withArgs(typePrompt).resolves({ type: serverType });
  }
  if (serverType === 'ms') {
    if (inputType === 'flags') {
      process.argv = process.argv.concat(['--type', 'ms', '--host', 'autolab.bits-goa.ac.in', '--port', '9000']);
    } else if (inputType === 'prompt') {
      this.promptStub.resolves({ host: 'autolab.bits-goa.ac.in', port: '9000' });
    }
  } else if (serverType === 'gitlab') {
    if (inputType === 'flags') {
      process.argv = process.argv.concat(['--type', 'gitlab', '--host', 'autolab.bits-goa.ac.in']);
    } else if (inputType === 'prompt') {
      this.promptStub.resolves({ host: 'autolab.bits-goa.ac.in' });
    }
  }
  await controller.start();
});

When('I run prefs command with changelang with invalid language', async function () {
  process.argv = ['/usr/local/nodejs/bin/node',
    '/usr/local/nodejs/bin/autolabjs', 'prefs', 'changelang', '--lang', 'javascript'];
  await controller.start();
});

When('I run prefs command with show', async function () {
  process.argv = ['/usr/local/nodejs/bin/node',
    '/usr/local/nodejs/bin/autolabjs', 'prefs', 'show'];
  await controller.start();
});

When('I run change server with invalid host for {string}', async function (serverType) {
  process.argv = ['/usr/local/nodejs/bin/node',
    '/usr/local/nodejs/bin/autolabjs', 'prefs', 'changeserver',
    '--type', serverType, '--host', 'abc', '--port', '9000'];
  await controller.start();
});

When('I run change server with invalid port', async function () {
  process.argv = ['/usr/local/nodejs/bin/node',
    '/usr/local/nodejs/bin/autolabjs', 'prefs', 'changeserver',
    '--type', 'ms', '--host', 'autolab.bits-goa.ac.in', '--port', '567E'];
  await controller.start();
});

When('I run prefs command with logger using {string} for {string}', async function (inputType, property) {
  process.argv = ['/usr/local/nodejs/bin/node',
    '/usr/local/nodejs/bin/autolabjs', 'prefs', 'logger'];

  const update = {
    blacklist: 'token',
    maxsize: '782290',
  };

  if (inputType === 'flags') {
    process.argv = process.argv.concat([`--${property}`, `${update[property]}`]);
  } else if (inputType === 'prompt') {
    this.promptStub.onFirstCall().resolves({ type: property });
    if (property === 'blacklist') {
      this.promptStub.onSecondCall().resolves({ keyword: update.blacklist });
    } else if (property === 'maxsize') {
      this.promptStub.onSecondCall().resolves({ maxsize: update.maxsize });
    }
  }
  await controller.start();
});

Then('I should be able to change the submission language', function (done) {
  preferenceManager.getPreference({ name: 'cliPrefs' }).submission.language.should.equal('cpp14');

  this.loggerStub.should.have.been.calledWith({ level: 'info', message: 'Prefs command invoked for', module: 'Prefs' });
  this.loggerStub.should.have.been.calledWith({ level: 'info', message: 'changelang', module: 'Prefs' });
  this.loggerStub.should.have.been.calledWith({ level: 'debug', message: 'Event for the prefs command called', module: 'Prefs' });
  this.loggerStub.should.have.been.calledWith({
    level: 'debug',
    message: '{"name":"lang_changed","details":{"lang":"cpp14"}}',
    module: 'Prefs',
  });
  done();
});

Then('I should be able to change the main server', function () {
  preferenceManager.getPreference({ name: 'cliPrefs' }).main_server.should.deep.equal({
    host: 'autolab.bits-goa.ac.in',
    port: '9000',
  });

  this.loggerStub.should.have.been.calledWith({ level: 'info', message: 'Prefs command invoked for', module: 'Prefs' });
  this.loggerStub.should.have.been.calledWith({ level: 'info', message: 'changeserver', module: 'Prefs' });
  this.loggerStub.should.have.been.calledWith({
    level: 'debug',
    message: '{"name":"server_changed","details":{"host":"autolab.bits-goa.ac.in","port":"9000","type":"ms"}}',
    module: 'Prefs',
  });
});

Then('I should be able to change the gitlab server', function () {
  preferenceManager.getPreference({ name: 'cliPrefs' }).gitlab.should.deep.equal({
    host: 'autolab.bits-goa.ac.in',
  });
  this.loggerStub.should.have.been.calledWith({ level: 'info', message: 'Prefs command invoked for', module: 'Prefs' });
  this.loggerStub.should.have.been.calledWith({ level: 'info', message: 'changeserver', module: 'Prefs' });
  this.loggerStub.should.have.been.calledWith({
    level: 'debug',
    message: '{"name":"server_changed","details":{"host":"autolab.bits-goa.ac.in","type":"gitlab"}}',
    module: 'Prefs',
  });
});

Then('I should be able to change logger file size', function (done) {
  const maxSize = 782290;
  preferenceManager.getPreference({ name: 'cliPrefs' }).logger.should.have.own.include({
    maxSize,
  });

  this.loggerStub.should.have.been.calledWith({ level: 'info', message: 'Prefs command invoked for', module: 'Prefs' });
  this.loggerStub.should.have.been.calledWith({ level: 'info', message: 'logger', module: 'Prefs' });
  this.loggerStub.should.have.been.calledWith({ level: 'debug', message: 'Event for the prefs command called', module: 'Prefs' });
  this.loggerStub.should.have.been.calledWith({
    level: 'debug',
    message: '{"name":"logger_pref_changed","details":{"maxSize":"782290"}}',
    module: 'Prefs',
  });
  done();
});

Then('I should be able to change logger blacklist', function (done) {
  preferenceManager.getPreference({ name: 'cliPrefs' }).logger.blacklist.should.include('token');

  this.loggerStub.should.have.been.calledWith({ level: 'info', message: 'Prefs command invoked for', module: 'Prefs' });
  this.loggerStub.should.have.been.calledWith({ level: 'info', message: 'logger', module: 'Prefs' });
  this.loggerStub.should.have.been.calledWith({ level: 'debug', message: 'Event for the prefs command called', module: 'Prefs' });
  this.loggerStub.should.have.been.calledWith({
    level: 'debug',
    message: '{"name":"logger_pref_changed","details":{"keyword":"token"}}',
    module: 'Prefs',
  });
  done();
});

Then('I should be able to see the preferences', function () {
  const prefsColWidth = 25;
  const valuesColWidth = 27;

  const table = new Table({
    head: [chalk.cyan('Preferences'), chalk.cyan('Values')],
    colWidths: [prefsColWidth, valuesColWidth],
  });

  const mainServerPort = 9000;
  const maxSize = 782290;

  table.push(
    ['Gitlab host', 'autolab.bits-goa.ac.in'],
    ['Main Server host', 'autolab.bits-goa.ac.in'],
    ['Main Server port', mainServerPort],
    ['Logger file MaxSize', maxSize],
    ['Log file Directory', '.autolabjs'],
    ['Log file name', 'cli.log'],
    ['Logger blacklist keys', ['log', 'password', 'privateToken', 'token']],
  );

  this.logSpy.should.have.been.calledWith(table.toString());

  this.loggerStub.should.have.been.calledWith({ level: 'info', message: 'Prefs command invoked for', module: 'Prefs' });
  this.loggerStub.should.have.been.calledWith({ level: 'info', message: 'show', module: 'Prefs' });
  this.loggerStub.should.have.been.calledWith({ level: 'debug', message: 'Event for the prefs command called', module: 'Prefs' });
  this.loggerStub.should.have.been.calledWith({ level: 'debug', message: '{"name":"show_prefs"}', module: 'Prefs' });
});

Then('I should be displayed an error message for invalid host', function () {
  this.logSpy.should.have.been.calledWith(chalk.red('Please provide a valid host'));

  this.loggerStub.should.have.been.calledWith({ level: 'info', message: 'Prefs command invoked for', module: 'Prefs' });
  this.loggerStub.should.have.been.calledWith({ level: 'info', message: 'changeserver', module: 'Prefs' });
  this.loggerStub.should.have.been.calledWith({ level: 'debug', message: 'Event for the prefs command called', module: 'Prefs' });
  this.loggerStub.should.have.been.calledWith({ level: 'debug', message: '{"name":"invalid_host"}', module: 'Prefs' });
});

Then('I should be displayed an error message for invalid port', function () {
  this.logSpy.should.have.been.calledWith(chalk.red('Please provide a valid port'));

  this.loggerStub.should.have.been.calledWith({ level: 'info', message: 'Prefs command invoked for', module: 'Prefs' });
  this.loggerStub.should.have.been.calledWith({ level: 'info', message: 'changeserver', module: 'Prefs' });
  this.loggerStub.should.have.been.calledWith({ level: 'debug', message: 'Event for the prefs command called', module: 'Prefs' });
  this.loggerStub.should.have.been.calledWith({ level: 'debug', message: '{"name":"invalid_port"}', module: 'Prefs' });
});

Then('I should be displayed an error message for invalid language', function (done) {
  this.logSpy.should.have.been.calledWith(chalk.red(`Please provide the a valid language. The supported languages are ${supportedLanguages}`));

  this.loggerStub.should.have.been.calledWith({ level: 'info', message: 'Prefs command invoked for', module: 'Prefs' });
  this.loggerStub.should.have.been.calledWith({ level: 'info', message: 'changelang', module: 'Prefs' });
  this.loggerStub.should.have.been.calledWith({ level: 'debug', message: 'Event for the prefs command called', module: 'Prefs' });
  this.loggerStub.should.have.been.calledWith({
    level: 'debug',
    message: '{"name":"invalid_lang","details":{"supportedLanguages":["java","c","cpp","cpp14","python2","python3"]}}',
    module: 'Prefs',
  });
  done();
});

Then('I should be displayed an error message for invalid keyword', function (done) {
  preferenceManager.getPreference({ name: 'cliPrefs' }).logger.blacklist.should.include('token');

  this.loggerStub.should.have.been.calledWith({ level: 'info', message: 'Prefs command invoked for', module: 'Prefs' });
  this.loggerStub.should.have.been.calledWith({ level: 'info', message: 'logger', module: 'Prefs' });
  this.loggerStub.should.have.been.calledWith({ level: 'debug', message: 'Event for the prefs command called', module: 'Prefs' });
  this.loggerStub.should.have.been.calledWith({ level: 'debug', message: '{"name":"invalid_blacklist_keyword"}', module: 'Prefs' });
  done();
});

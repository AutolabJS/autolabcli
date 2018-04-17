const {
  Given, When, Then, Before, After,
} = require('cucumber');
const Preferences = require('preferences');
const { exec } = require('child_process');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const fs = require('fs');
const chalk = require('chalk');
const inquirer = require('inquirer');
const Table = require('cli-table');
const controller = require('../../../lib/controller');
const preferenceManager = require('../../../lib/utils/preference-manager');
const path = require('path');

const defaultPrefPath = path.join(__dirname, '../../../default-prefs.json');
const defaultPrefs = JSON.parse(require('fs').readFileSync(defaultPrefPath, 'utf8'));

const { supportedLanguages } = defaultPrefs;

chai.use(sinonChai);
chai.should();

When('I run prefs command with {string} using {string}', async (argument, inputType) => {
  process.argv = ['/usr/local/nodejs/bin/node',
    '/usr/local/nodejs/bin/autolabjs', 'prefs', argument];
  if (argument === 'changeserver') {
    if (inputType === 'flags') {
      process.argv = process.argv.concat(['--host', 'autolab.bits-goa.ac.in', '--port', '9000']);
    } else if (inputType === 'prompt') {
      global.promptStub.resolves({ host: 'autolab.bits-goa.ac.in', port: '9000' });
    }
  }
  if (argument === 'changelang') {
    if (inputType === 'flags') {
      process.argv = process.argv.concat(['--lang', 'cpp14']);
    } else if (inputType === 'prompt') {
      global.promptStub.resolves({ lang: 'cpp14' });
    }
  }
  await controller.start();
});

When('I run prefs command with changelang with invalid language', async () => {
  process.argv = ['/usr/local/nodejs/bin/node',
    '/usr/local/nodejs/bin/autolabjs', 'prefs', 'changelang', '--lang', 'javascript'];
  await controller.start();
});

When('I run prefs command with show', async () => {
  process.argv = ['/usr/local/nodejs/bin/node',
    '/usr/local/nodejs/bin/autolabjs', 'prefs', 'show'];
  await controller.start();
});

When('I run change server with invalid host', async () => {
  process.argv = ['/usr/local/nodejs/bin/node',
    '/usr/local/nodejs/bin/autolabjs', 'prefs', 'changeserver',
    '--host', 'abc', '--port', '9000'];
  await controller.start();
});

When('I run change server with invalid port', async () => {
  process.argv = ['/usr/local/nodejs/bin/node',
    '/usr/local/nodejs/bin/autolabjs', 'prefs', 'changeserver',
    '--host', 'autolab.bits-goa.ac.in', '--port', '567E'];
  await controller.start();
});

Then('I should be able to change the submission language', () => {
  preferenceManager.getPreference({ name: 'cliPrefs' }).submission.language.should.equal('cpp14');
});

Then('I should be able to change the submission server', () => {
  preferenceManager.getPreference({ name: 'cliPrefs' }).main_server.should.deep.equal({
    host: 'autolab.bits-goa.ac.in',
    port: '9000',
  });
});

Then('I should be able to see the preferences', () => {
  const table = new Table({
    head: [chalk.cyan('Preferences'), chalk.cyan('Values')],
    colWidths: [15, 25],
  });
  table.push(
    ['Language', 'cpp14'],
    ['Server host', 'autolab.bits-goa.ac.in'],
    ['Server port', 9000],
  );

  global.logSpy.should.have.been.calledWith(table.toString());
});

Then('I should be displayed an error message for invalid host', () => {
  global.logSpy.should.have.been.calledWith(chalk.red('Please provide a valid host'));
});

Then('I should be displayed an error message for invalid port', () => {
  global.logSpy.should.have.been.calledWith(chalk.red('Please provide a valid port'));
});

Then('I should be displayed an error message for invalid language', () => {
  global.logSpy.should.have.been.calledWith(chalk.red(`Please provide the a valid language. The supported languages are ${supportedLanguages}`));
});

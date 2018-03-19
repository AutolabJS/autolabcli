const { Given, When, Then, Before, After } = require('cucumber');
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

chai.use(sinonChai);
chai.should();

When('I run prefs command with {string}', (argument) => {
  process.argv = [ '/usr/local/nodejs/bin/node',
    '/usr/local/nodejs/bin/autolab', 'prefs', argument];
  if (argument === 'changeserver') {
    process.argv = process.argv.concat(['--url', 'abc', '--port', '5678']);
  }
  if (argument === 'changelang') {
    const mockInquirer = sinon.mock(inquirer);
    mockInquirer.expects('prompt').returns(Promise.resolve({lang: 'cpp14'}));
  }
  controller.start();
});

Then('I should be able to change the submission language', () => {
  preferenceManager.getPreference({name: 'cliPrefs'}).submission.language.should.equal('cpp14');
});

Then('I should be able to change the submission server', () => {
  preferenceManager.getPreference({name: 'cliPrefs'}).main_server.should.deep.equal({
    host: 'abc',
    port: '5678'
  });
});

Then('I should be able to see the preferences', (done) => {
  const table = new Table({
      head: [chalk.cyan('Preferences'), chalk.cyan('Values')]
    , colWidths: [15, 25]
  });
  table.push(
    ['Language', 'cpp14'],
    ['Server url', 'abc'],
    ['Server port', 5678]
  );

  setTimeout(()=> {
    global.logSpy.should.have.been.calledWith(table.toString());
    done();
  }, 0);
});

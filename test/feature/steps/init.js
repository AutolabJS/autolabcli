const { Given, When, Then, Before, After } = require('cucumber');
const Preferences = require('preferences');
const { exec } = require('child_process');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const path = require('path');
const figlet = require('figlet');
const chalk = require('chalk');
const controller = require('../../../lib/controller');
const preferenceManager = require('../../../lib/utils/preference-manager');

chai.use(sinonChai);
chai.should();

let logSpy;

Before(() => {
  logSpy = sinon.stub(console, 'log');
});

After(() => {
  logSpy.restore();
});

Given('a valid username as {string} and corresponding password as {string}', (user, pass) => {
  username = user;
  password = pass;
});

When('I run init command with {string} as username and {string} as password using {string}', (username, password, inputType, done) => {
  if(inputType === 'flags') {
      exec(`autolabjs init -u ${username} -p ${password}`, (err, stdout, stderr) => {
        errorOutput = stdout;
        done();
      });
  }
  else if(inputType === 'prompt') {
      const stdin = require('mock-stdin').stdin();
      process.argv = [ '/usr/local/nodejs/bin/node',
        '/usr/local/nodejs/bin/autolab', 'init' ];
      controller.start();
      setTimeout(() => stdin.send(`${username}\n`), 1);
      setTimeout(() => stdin.send(`${password}\n`), 2);
      setTimeout(() => {
        done();
      },3);
  }
});

Then('My login credentials and private token should be stored locally', () => {
  const gitLabPref = preferenceManager.getGitLabCredentials();
  gitLabPref.username.should.equal(username);
  gitLabPref.password.should.equal(password);
  gitLabPref.privateToken.should.not.be.empty;
});

Then('I should be displayed a warning message when input is given using {string}', (inputType, done) => {
  if(inputType === 'prompt') {
    setTimeout(() => {
      logSpy.withArgs(chalk.red('\nInvalid Username or Password')).should.have.been.called;
      done();
    }, 500);
  }
  else if (inputType === 'flags') {
    errorOutput.should.contain('Invalid Username or Password');
    done();
  }
});

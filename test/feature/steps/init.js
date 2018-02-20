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

chai.use(sinonChai);
chai.should();

let username, password, logSpy;

Before(() => {
  logSpy = sinon.spy(console, 'log');
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
  const gitLabPref = new Preferences('autolabjs.gitlab');
  gitLabPref.username.should.equal(username);
  gitLabPref.password.should.equal(password);
  gitLabPref.privateToken.should.not.be.empty;
});

Then('I should be displayed a warning message', () => {
  logSpy.should.have.been.calledWith(chalk.red('Invalid Username or Password'));
});

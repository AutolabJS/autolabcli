const { Given, When, Then, Before, After } = require('cucumber');
const Preferences = require('preferences');
const { exec } = require('child_process');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const fs = require('fs');
const chalk = require('chalk');
const controller = require('../../../lib/controller');
const preferenceManager = require('../../../lib/utils/preference-manager');

chai.use(sinonChai);
chai.should();

Given('I have already logged in', () => {
});

When('I run exit command', () => {
  process.argv = [ '/usr/local/nodejs/bin/node',
    '/usr/local/nodejs/bin/autolab', 'exit' ];
  controller.start();
});

Then('My login credentials should be removed', () => {
  preferenceManager.getPrivateToken().should.equal('');
  preferenceManager.getStoredTime().should.equal(-1);
});

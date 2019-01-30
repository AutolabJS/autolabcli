const { Before, After } = require('cucumber');
const sinon = require('sinon');
const inquirer = require('inquirer');
const { logger } = require('../../../lib/utils/logger');

// These hooks run before each scenario, of every feature.

Before(function () {
  this.promptStub = sinon.stub(inquirer, 'prompt');
  this.logSpy = sinon.stub(console, 'log');
  this.loggerStub = sinon.stub(logger, 'log');
});

After(function () {
  this.promptStub.restore();
  this.logSpy.restore();
  this.loggerStub.restore();
});

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chalk = require('chalk');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);
chai.should();

const commandValidator = require('@utils/command-validator');
const preferenceManager = require('@utils/preference-manager');

chai.use(chaiAsPromised);
chai.should();

describe('for command validator', () => {
  const sandbox = sinon.createSandbox();

  it('should have session validator as expected', () => {
    const logSpy = sandbox.stub(console, 'log');
    const mockPreferenceManager = sandbox.mock(preferenceManager);
    mockPreferenceManager.expects('getPreference').once().returns(-1);

    const isValid = commandValidator.validateSession();

    logSpy.should.have.been.calledWith(chalk.red('Your session has expired. Please run \'autolabjs init\' to login again'));
    isValid.should.equal(false);
    mockPreferenceManager.verify();
    sandbox.restore();
  });

  it('should return true for valid session', () => {
    const mockPreferenceManager = sandbox.mock(preferenceManager);
    mockPreferenceManager.expects('getPreference').once().returns({ storedTime: Date.now() });

    const isValid = commandValidator.validateSession();

    isValid.should.equal(true);
    mockPreferenceManager.verify();
    sandbox.restore();
  });
});

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const validator = require('../../../../lib/controller/validation');
const prefsOutput = require('../../../../lib/cli/output/prefs');

chai.should();
chai.use(sinonChai);

const sandbox = sinon.createSandbox();

describe('for validation', function () {
  afterEach(function () {
    sandbox.restore();
  });

  it('should return true on correct command', testValidCommand);
  it('should call prefs output with correct arguments on invalid command', testInvalidPrefsCommand);
  it('should call prefs output with correct arguments on invalid server', testInvalidServer);
});

function testValidCommand(done) {
  const testArgs = {
    preference: 'changeserver',
  };
  const testOptions = {
    type: 'ms',
  };

  validator.prefs(testArgs, testOptions).should.be.equal(true);
  done();
}

function testInvalidPrefsCommand(done) {
  const mockprefsOutput = sandbox.mock(prefsOutput);
  const testArgs = {
    preference: 'represent',
  };

  mockprefsOutput.expects('sendOutput').withExactArgs({ name: 'invalid_command' });

  validator.prefs(testArgs).should.be.equal(false);
  mockprefsOutput.verify();
  done();
}

function testInvalidServer(done) {
  const mockprefsOutput = sandbox.mock(prefsOutput);
  const testArgs = {
    preference: 'changeserver',
  };
  const testOptions = {
    type: 'github',
  };
  const supportedServers = ['ms', 'gitlab'];

  mockprefsOutput.expects('sendOutput').withExactArgs({
    name: 'invalid_server',
    details: {
      supportedServers,
    },
  });

  validator.prefs(testArgs, testOptions).should.be.equal(false);
  mockprefsOutput.verify();
  done();
}

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const program = require('caporal');

const { logger } = require('../../../../lib/utils/logger');
const prefsInput = require('../../../../lib/cli/input/prefs');
const prefsOutput = require('../../../../lib/cli/output/prefs');
const prefsModel = require('../../../../lib/model/prefs');
const prefsController = require('../../../../lib/controller/prefs');
const validator = require('../../../../lib/controller/validation');

chai.use(sinonChai);
chai.should();

const sandbox = sinon.createSandbox();

describe('For prefs controller', function () {
  beforeEach(function () {
    const mocklogger = sandbox.stub(logger);
    program.logger(mocklogger);
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('should call the prefs action of program with right arguments when command is valid', testPrefsValid);
  it('should exits the program when command is invalid', testPrefsInvalid);
});

/* eslint-disable max-lines-per-function */
function testPrefsValid(done) {
  const mockprefsInput = sandbox.mock(prefsInput);
  const mockprefsOutput = sandbox.mock(prefsOutput);
  const mockprefsModel = sandbox.mock(prefsModel);
  const mockValidator = sandbox.mock(validator);

  const testMsPort = 8999;

  const changedPrefs = {
    name: 'server_changed',
    details: {
      type: 'ms',
      host: 'abc',
      port: testMsPort,
    },
  };
  mockprefsInput.expects('getInput').once().withExactArgs({ preference: 'changeserver' }, {
    type: 'ms', host: 'abc', port: '8999', lang: undefined, maxsize: undefined, blacklist: undefined,
  }).resolves(changedPrefs);
  mockprefsModel.expects('storePrefs').withExactArgs(changedPrefs).resolves(changedPrefs);
  mockprefsOutput.expects('sendOutput').withExactArgs(changedPrefs);
  mockValidator.expects('prefs').withExactArgs({ preference: 'changeserver' }, {
    type: 'ms', host: 'abc', port: '8999', lang: undefined, maxsize: undefined, blacklist: undefined,
  }).returns(true);

  prefsController.addTo(program);

  program.exec(['prefs', 'changeserver'], {
    type: 'ms',
    host: 'abc',
    port: '8999',
  });

  setTimeout(() => {
    mockprefsInput.verify();
    mockprefsOutput.verify();
    mockprefsModel.verify();
    mockValidator.verify();
    done();
  }, 0);
}

function testPrefsInvalid(done) {
  const mockValidator = sandbox.mock(validator);
  mockValidator.expects('prefs').withExactArgs({ preference: 'changeserver' }, {
    type: 'github', host: 'abc', port: '8999', lang: undefined, maxsize: undefined, blacklist: undefined,
  }).returns(false);

  prefsController.addTo(program);

  program.exec(['prefs', 'changeserver'], {
    type: 'github',
    host: 'abc',
    port: '8999',
  });

  setTimeout(() => {
    mockValidator.verify();
    done();
  }, 0);
}

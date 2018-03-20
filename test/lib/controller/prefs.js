const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const program = require('caporal');

const prefsInput = require('../../../lib/cli/input/prefs');
const prefsOutput = require('../../../lib/cli/output/prefs');
const prefsModel = require('../../../lib/model/prefs');
const prefsController = require('../../../lib/controller/prefs');
const commandValidator = require('../../../lib/utils/command-validator');

chai.use(sinonChai);
chai.should();

describe('For prefs controller', () => {

  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  it('should call the prefs action of program with right arguments when command is valid', (done) => {

    const mockprefsInput = sandbox.mock(prefsInput);
    const mockprefsOutput = sandbox.mock(prefsOutput);
    const mockprefsModel = sandbox.mock(prefsModel);
    const mockCommadValidator = sandbox.mock(commandValidator);

    mockCommadValidator.expects('validateSession').once().returns(true);

    const changedPrefs = {
      name: 'server_changed',
      details: {
        host: 'abc',
        port: 8999
      }
    };
    mockprefsInput.expects('getInput').once().withExactArgs(
      {preference: 'changeserver'}, { host: 'abc', port: '8999', lang: undefined}
    ).returns(
      Promise.resolve(changedPrefs));
    mockprefsModel.expects('storePrefs').withExactArgs(changedPrefs).returns(Promise.resolve(changedPrefs));
    mockprefsOutput.expects('sendOutput').withExactArgs(changedPrefs);

    prefsController.addTo(program);

    program.exec(['prefs', 'changeserver'], {
      host: 'abc',
      port: '8999'
    });

    setTimeout(() => {
      mockCommadValidator.verify();
      mockprefsInput.verify();
      mockprefsOutput.verify();
      mockprefsModel.verify();
      done();
    }, 0);
  });

  it('should not execute when already logged out', (done) => {

    const mockprefsOutput = sandbox.mock(prefsOutput);
    const mockprefsInput = sandbox.mock(prefsInput);
    const mockCommandValidator = sandbox.mock(commandValidator);

    mockCommandValidator.expects('validateSession').once().returns(false);
    mockprefsInput.expects('getInput').once().never();

    prefsController.addTo(program);

    program.exec(['prefs', 'changelang'], {});

    setTimeout(() => {
      mockCommandValidator.verify();
      mockprefsInput.verify();
      done();
    }, 0);

  });
});

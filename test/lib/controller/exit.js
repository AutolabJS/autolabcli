const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const program = require('caporal');

const exitOutput = require('../../../lib/cli/output/exit');
const exitModel = require('../../../lib/model/exit');
const exitController = require('../../../lib/controller/exit');
const commandValidator = require('../../../lib/utils/command-validator');

chai.use(sinonChai);
chai.should();

describe('For exit controller', () => {

  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  it('should call the action of program with right arguments', (done) => {

    const mockexitOutput = sandbox.mock(exitOutput);
    const mockexitModel = sandbox.mock(exitModel);
    const mockCommandValidator = sandbox.mock(commandValidator);

    mockCommandValidator.expects('validateSession').once().returns(true);
    mockexitModel.expects('logout').once();
    mockexitOutput.expects('sendOutput').once().withExactArgs({
        name: 'logout_success'
    });

    exitController.addTo(program);

    program.exec(['exit'], {});

    setTimeout(() => {
      mockCommandValidator.verify();
      mockexitOutput.verify();
      mockexitModel.verify();
      done();
    }, 0);

  });

  it('should not execute when already exited', (done) => {

    const mockexitOutput = sandbox.mock(exitOutput);
    const mockexitModel = sandbox.mock(exitModel);
    const mockCommandValidator = sandbox.mock(commandValidator);

    mockCommandValidator.expects('validateSession').once().returns(false);
    mockexitModel.expects('logout').never();

    exitController.addTo(program);

    program.exec(['exit'], {});

    setTimeout(() => {
      mockCommandValidator.verify();
      mockexitModel.verify();
      done();
    }, 0);

  });

});

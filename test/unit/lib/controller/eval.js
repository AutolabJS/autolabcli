const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const program = require('caporal');

const { logger } = require('../../../../lib/utils/logger');
const evalInput = require('../../../../lib/cli/input/eval');
const evalOutput = require('../../../../lib/cli/output/eval');
const evalModel = require('../../../../lib/model/eval');
const evalController = require('../../../../lib/controller/eval');
const evalValidator = require('../../../../lib/controller/validate/eval');
const commandValidator = require('../../../../lib/utils/command-validator');

chai.use(sinonChai);
chai.should();

const sandbox = sinon.createSandbox();

const mockOptions = {
  name: 'evaluate',
  details: {
    lab: 'test3',
    lang: 'java',
    idNo: 'testuser',
    commitHash: '',
  },
};

describe('For eval controller', function () {
  beforeEach(function () {
    const mocklogger = sandbox.stub(logger);
    program.logger(mocklogger);
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('should call the eval action of program with right arguments when command is valid', testEvalCommandValid);
  it('should NOT proceed for invalid session', testInvalidSession);
});

// eslint-disable-next-line max-lines-per-function
async function testEvalCommandValid() {
  const mockevalInput = sandbox.mock(evalInput);
  const mockevalOutput = sandbox.mock(evalOutput);
  const mockevalValidator = sandbox.mock(evalValidator);
  const mockcommandValidator = sandbox.mock(commandValidator);
  const mockEvalResult = { name: 'scores' };

  mockcommandValidator.expects('validateSession').once().returns(true);

  mockevalInput.expects('getInput').once().withExactArgs({}, {
    l: 'test3', lang: 'java', hash: undefined, i: undefined,
  }).resolves(mockOptions);
  mockevalValidator.expects('validate').withExactArgs(mockOptions).returns(mockOptions);
  mockevalOutput.expects('sendOutput').withExactArgs({
    name: 'eval_started',
  });
  const mockEvaluate = sandbox.stub(evalModel, 'evaluate').callsFake(() => {
    const cb = mockEvaluate.getCalls()[0].args[1];
    cb(mockEvalResult);
  });
  mockevalOutput.expects('sendOutput').withExactArgs(mockEvalResult);

  evalController.addTo(program);

  await program.exec(['eval'], {
    l: 'test3',
    lang: 'java',
  });

  mockevalInput.verify();
  mockevalOutput.verify();
  mockcommandValidator.verify();
  mockevalValidator.verify();
}

async function testInvalidSession() {
  const mockevalOutput = sandbox.mock(evalOutput);
  const mockcommandValidator = sandbox.mock(commandValidator);

  mockcommandValidator.expects('validateSession').once().returns(false);
  mockevalOutput.expects('sendOutput').never();

  evalController.addTo(program);

  await program.exec(['eval'], {
    l: 'test3',
    lang: 'java',
  });

  mockevalOutput.verify();
}

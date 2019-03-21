const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const program = require('caporal');

const { logger } = require('../../../../lib/utils/logger');
const showInput = require('../../../../lib/cli/input/show');
const showOutput = require('../../../../lib/cli/output/show');
const showModel = require('../../../../lib/model/show');
const showController = require('../../../../lib/controller/show');
const showValidator = require('../../../../lib/controller/validate/show');

chai.use(sinonChai);
chai.should();

const sandbox = sinon.createSandbox();

describe('For eval controller', function () {
  beforeEach(function () {
    const mocklogger = sandbox.stub(logger);
    program.logger(mocklogger);
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('should call the eval action of program with right arguments when command is valid', testShowCommandValid);
  // it('should exits the program when command is invalid', testShowInvalid);
});

// eslint-disable-next-line max-lines-per-function
function testShowCommandValid(done) {
  const mockshowInput = sandbox.mock(showInput);
  const mockshowOutput = sandbox.mock(showOutput);
  const mockshowValidator = sandbox.mock(showValidator);

  const testOptions = {
    name: 'score',
    details: {
      lab: 'test',
      id: 'test_user',
    },
  };

  const testResult = { name: 'score' };

  mockshowInput.expects('getInput').once().withExactArgs({ statistic: 'score' }, {
    l: 'test', i: 'test_user',
  }).resolves(testOptions);
  mockshowValidator.expects('validate').withExactArgs(testOptions).returns(testOptions);
  mockshowOutput.expects('sendOutput').withExactArgs({ name: 'fetching_results' });
  const mockShow = sandbox.stub(showModel, 'show').callsFake(() => {
    const cb = mockShow.getCalls()[0].args[1];
    cb(testResult);
  });
  mockshowOutput.expects('sendOutput').withExactArgs(testResult);

  showController.addTo(program);
  program.exec(['show', 'score'], {
    l: 'test',
    i: 'test_user',
  });

  setTimeout(() => {
    mockshowInput.verify();
    mockshowValidator.verify();
    mockshowOutput.verify();
    done();
  }, 0);
}

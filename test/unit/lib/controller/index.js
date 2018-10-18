const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const program = require('caporal');

const { logger } = require('../../../../lib/utils/logger');
const controller = require('../../../../lib/controller');
const initController = require('../../../../lib/controller/init');

chai.use(sinonChai);
chai.should();

describe('For controller entry point', () => {
  const sandbox = sinon.createSandbox();

  beforeEach(() => {
    const mocklogger = sandbox.stub(logger);
    program.logger(mocklogger);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should call the other controllers', () => {
    const mockInitController = sandbox.mock(initController);
    const mockProgram = sandbox.mock(program);

    mockInitController.expects('addTo').once().withExactArgs(program);
    mockProgram.expects('parse').once().withExactArgs(process.argv);

    controller.start();

    mockInitController.verify();
    mockProgram.verify();
  });
});

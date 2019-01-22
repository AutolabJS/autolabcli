const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const program = require('caporal');

const controller = require('controller');
const initController = require('controller/init');

chai.use(sinonChai);
chai.should();

describe('For controller entry point', () => {
  const sandbox = sinon.createSandbox();

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

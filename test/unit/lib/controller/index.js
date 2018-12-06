const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const program = require('caporal');

const controller = require('../../../../lib/controller');
const initController = require('../../../../lib/controller/init');

chai.use(sinonChai);
chai.should();

const sandbox = sinon.createSandbox();

describe('For controller entry point', function () {
  afterEach(function () {
    sandbox.restore();
  });

  it('should call the other controllers', testController);
});


function testController(done) {
  const mockInitController = sandbox.mock(initController);
  const mockProgram = sandbox.mock(program);

  mockInitController.expects('addTo').once().withExactArgs(program);
  mockProgram.expects('parse').once().withExactArgs(process.argv);

  controller.start();

  mockInitController.verify();
  mockProgram.verify();
  done();
}

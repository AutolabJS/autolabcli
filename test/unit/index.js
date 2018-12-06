const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const { exec } = require('child_process');

const controller = require('../../lib/controller');

chai.use(sinonChai);
chai.should();

const sandbox = sinon.createSandbox();


describe('For application entry point', function () {
  afterEach(function () {
    sandbox.restore();
  });

  it('should start the controller', testStartController);
});

function testStartController() {
  const mockController = sandbox.mock(controller);
  mockController.expects('start').once();
  exec('npm link;autolabjs', () => {
    mockController.verify();
  });
}

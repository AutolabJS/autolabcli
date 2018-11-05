const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const { exec } = require('child_process');

const controller = require('../../lib/controller');

chai.use(sinonChai);
chai.should();

const sandbox = sinon.createSandbox();

const testStartController = () => {
  const mockController = sandbox.mock(controller);
  mockController.expects('start').once();
  exec('npm link;autolabjs', () => {
    mockController.verify();
  });
};

describe('For application entry point', () => {
  afterEach(() => {
    sandbox.restore();
  });

  it('should start the controller', testStartController);
});

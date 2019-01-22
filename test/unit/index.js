const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const { exec } = require('child_process');

const controller = require('controller');

chai.use(sinonChai);
chai.should();

describe('For application entry point', () => {
  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  it('should start the controller', () => {
    const mockController = sandbox.mock(controller);
    mockController.expects('start').once();
    exec('npm link;autolabjs', (err, stdout, stderr) => {
      mockController.verify();
    });
  });
});

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const { exec } = require('child_process');

const controller = require('../lib/controller');

chai.use(sinonChai);
chai.should();

describe('For application entry point', () => {

  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  it('should start the controller', () => {
    const startStub = sandbox.stub(controller, 'start');
    exec('npm link;autolabjs', (err, stdout, stderr) => {
      startStub.should.have.been.called;
    });
  });
});

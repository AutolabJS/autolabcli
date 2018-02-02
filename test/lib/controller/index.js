const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const program = require('caporal');

const controller = require('../../../lib/controller');
const initController = require('../../../lib/controller/init');

chai.use(sinonChai);
chai.should();

describe('For controller entry point', () => {

  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  it('should call the other controllers', () => {
    const initAddToStub = sandbox.stub(initController, 'addTo');
    const parseStub = sandbox.stub(program, 'parse');

    controller.start();

    initAddToStub.should.have.been.deep.calledWith(program);
    parseStub.should.have.been.deep.calledWith(process.argv);
  });
});

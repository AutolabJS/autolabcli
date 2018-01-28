const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const program = require('caporal');

const controller = require('../../../lib/controller');
const initController = require('../../../lib/controller/init');

const { expect } = chai;

chai.use(sinonChai);
chai.should();

describe('For controller entry point', () => {

  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  it('should call the other controllers', () => {
    const initAddToSpy = sandbox.spy(initController, 'addTo');
    program
      .version('1.0.0')
      .description('A Command Line Interface (CLI) for AutolabJS');
    sinon.stub(program, 'parse').callsFake(() => {});

    controller.start();
    expect(initAddToSpy).to.have.been.deep.calledWith(program);
  });
});

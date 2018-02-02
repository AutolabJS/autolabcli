const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const program = require('caporal');

const initInput = require('../../../lib/cli/input/init');
const initOutput = require('../../../lib/cli/output/init');
const initModel = require('../../../lib/model/init');
const initController = require('../../../lib/controller/init');

chai.use(sinonChai);
chai.should();

describe('For init controller', () => {

  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  it('should call the action of program with right arguments', (done) => {

    const getInputstub = sandbox.stub(initInput, 'getInput').withArgs(
      {}, { u: 'testuser1', p: '123'}
    ).returns(
      Promise.resolve({username: 'testuser1', password: '123'})
    )
    const sendResultstub = sandbox.stub(initOutput, 'sendResult');
    const sendWelcomestub = sandbox.stub(initOutput, 'sendWelcome');

    initController.addTo(program);

    program.exec(['init'], {
      u: 'testuser1',
      p: '123'
    });

    getInputstub.should.have.been.called;
    setTimeout(() => {
      sendWelcomestub.should.have.been.called;
    }, 0);
    setTimeout(() => {
      sendResultstub.should.have.been.calledWith('testuser1', '123');
      done();
    }, 0);

  });
});

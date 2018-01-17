const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const program = require('caporal');

const initInput = require('../../../lib/cli/input/init');
const initOutput = require('../../../lib/cli/output/init');
const initModel = require('../../../lib/model/init');
const initController = require('../../../lib/controller/init');

const { expect } = chai;

chai.use(sinonChai);
chai.should();

describe('For init controller', () => {
  it('should call the action of program with right arguments', (done) => {

    const getInputSpy = sinon.spy(initInput, 'getInput');
    const getOutputStringSpy = sinon.spy(initModel, 'getOutputString');
    const sendResultSpy = sinon.spy(initOutput, 'sendResult');
    const sendWelcomeSpy = sinon.spy(initOutput, 'sendWelcome');

    initController.addTo(program);

    expect(getInputSpy).to.not.have.been.called;
    expect(getOutputStringSpy).to.not.have.been.called;
    expect(sendResultSpy).to.not.have.been.called;
    expect(sendWelcomeSpy).to.not.have.been.called;

    program.exec(['init'], {
      u: 'testuser1',
      p: '123'
    });

    expect(getInputSpy).to.have.been.called;
    setTimeout(() => {expect(getOutputStringSpy).to.have.been.called}, 0);
    setTimeout(() => {expect(sendWelcomeSpy).to.have.been.called}, 0);
    setTimeout(() => {expect(sendResultSpy).to.have.been.called; done()}, 0);

  });
});

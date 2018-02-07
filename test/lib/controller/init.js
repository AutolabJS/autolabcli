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

    const mockInitInput = sandbox.mock(initInput);
    const mockInitOutput = sandbox.mock(initOutput);

    mockInitInput.expects('getInput').once().withExactArgs(
      {}, { u: 'testuser1', p: '123'}
    ).returns(
      Promise.resolve({username: 'testuser1', password: '123'})
    );

    mockInitOutput.expects('sendWelcome').once();
    mockInitOutput.expects('sendResult').once();


    initController.addTo(program);

    program.exec(['init'], {
      u: 'testuser1',
      p: '123'
    });

    setTimeout(() => {
      mockInitInput.verify();
      mockInitOutput.verify();
      done();
    }, 0);

  });
});

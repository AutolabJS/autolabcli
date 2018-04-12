const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const program = require('caporal');

const initInput = require('../../../../lib/cli/input/init');
const initOutput = require('../../../../lib/cli/output/init');
const initModel = require('../../../../lib/model/init');
const initController = require('../../../../lib/controller/init');

chai.use(sinonChai);
chai.should();

describe('For init controller', () => {
  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  it('should call the action of program with right arguments', async () => {
    const mockInitInput = sandbox.mock(initInput);
    const mockInitOutput = sandbox.mock(initOutput);
    const mockInitModel = sandbox.mock(initModel);

    mockInitOutput.expects('sendOutput').withExactArgs({
      name: 'welcome',
    });
    mockInitInput.expects('getInput').once().withExactArgs({}, { u: 'testuser1', p: '123' }).resolves({ username: 'testuser1', password: '123' });
    mockInitOutput.expects('sendOutput').withExactArgs({
      name: 'authentication_started',
    });
    mockInitModel.expects('authenticate').withExactArgs({
      username: 'testuser1',
      password: '123',
    }).resolves({
      name: 'test_user1',
      code: 200,
    });
    mockInitOutput.expects('sendOutput').withExactArgs({
      name: 'authentication_ended',
      details: {
        name: 'test_user1',
        code: 200,
      },
    });

    initController.addTo(program);

    await program.exec(['init'], {
      u: 'testuser1',
      p: '123',
    });

    mockInitInput.verify();
    mockInitOutput.verify();
    mockInitModel.verify();
  });
});

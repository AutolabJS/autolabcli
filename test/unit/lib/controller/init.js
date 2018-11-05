const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const program = require('caporal');

const { logger } = require('../../../../lib/utils/logger');
const initInput = require('../../../../lib/cli/input/init');
const initOutput = require('../../../../lib/cli/output/init');
const initModel = require('../../../../lib/model/init');
const initController = require('../../../../lib/controller/init');

chai.use(sinonChai);
chai.should();

const sandbox = sinon.createSandbox();

/* eslint-disable max-lines-per-function */
const testInitValid = async () => {
  const mockInitInput = sandbox.mock(initInput);
  const mockInitOutput = sandbox.mock(initOutput);
  const mockInitModel = sandbox.mock(initModel);

  const httpOK = 200;

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
    code: httpOK,
  });
  mockInitOutput.expects('sendOutput').withExactArgs({
    name: 'authentication_ended',
    details: {
      name: 'test_user1',
      code: httpOK,
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
};

describe('For init controller', () => {
  beforeEach(() => {
    const mocklogger = sandbox.stub(logger);
    program.logger(mocklogger);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should call the action of program with right arguments', testInitValid);
});

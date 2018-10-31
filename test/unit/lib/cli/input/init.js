const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const inquirer = require('inquirer');
const initInput = require('../../../../../lib/cli/input/init');

chai.use(chaiAsPromised);
chai.use(sinonChai);
chai.should();

const mockUser = { u: 'testuser', p: '123' };

describe('for init getInput', () => {
  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  it('should return promise with correct values when flags provided', async () => {
    const ret = await initInput.getInput(null, mockUser);
    ret.should.deep.equal({
      username: 'testuser',
      password: '123',
    });
  });

  it('should return promise with correct values when flags not provided', () => {
    const mockInquirer = sandbox.mock(inquirer);
    mockInquirer.expects('prompt').resolves({ username: 'testuser2', password: '123' });

    return initInput.getInput(null, {}).should.eventually.deep.equal({
      username: 'testuser2',
      password: '123',
    });
  });

  it('should not accept empty getInput', async (done) => {
    let promptStub;
    const invalidInputTester = () => {
      try {
        const emptyUsernamePrompt = promptStub.getCalls()[0].args[0][0].validate('');
        const emptyPasswordPrompt = promptStub.getCalls()[0].args[0][1].validate('');
        promptStub.getCalls()[0].args[0][0].validate('testuser2').should.equal(true);
        emptyUsernamePrompt.should.equal('Please enter your username');
        emptyPasswordPrompt.should.equal('Please enter your password');
      } finally {
        done();
      }
    };

    promptStub = sandbox.stub(inquirer, 'prompt').callsFake(invalidInputTester);
    await initInput.getInput(null, {});
  });
});

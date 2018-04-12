const evalInput = require('../../../../../lib/cli/input/eval');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const inquirer = require('inquirer');
const preferenceManager = require('../../../../../lib/utils/preference-manager');

chai.use(chaiAsPromised);
chai.use(sinonChai);
chai.should();

const mockOptions = {
  lab: 'test3',
  lang: 'java',
  idNo: 'testuser',
  commitHash: '',
};

describe('for eval getInput', () => {
  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  it('should return promise with correct values when flags provided', async () => {
    const mockPreferenceManager = sandbox.mock(preferenceManager);
    mockPreferenceManager.expects('getPreference').once().returns({ username: 'testuser' });
    const evalOptions = await evalInput.getInput(null, {
      l: 'test3',
      lang: 'java',
    });
    evalOptions.should.deep.equal(mockOptions);
  });

  it('should return promise with correct values when flags not provided', () => {
    const mockInquirer = sandbox.mock(inquirer);
    mockInquirer.expects('prompt').resolves(mockOptions);

    return evalInput.getInput(null, { l: 'test3', lang: 'cpp15' }).should.eventually.deep.equal(mockOptions);
  });

  it('should not accept empty getInput', async () => {
    let promptStub;
    const invalidInputTester = () => {
      const prompt = promptStub.getCalls()[0].args[0][0];
      const emptyLabPrompt = prompt.validate('');
      emptyLabPrompt.should.equal('Please enter the lab name');
      const validLab = prompt.validate('test3');
      validLab.should.equal(true);
      return mockOptions;
    };

    promptStub = sandbox.stub(inquirer, 'prompt').callsFake(invalidInputTester);
    const ret = await evalInput.getInput(null, {});
  });

  it('should return id provided in options for root user', async () => {
    const mockPreferenceManager = sandbox.mock(preferenceManager);
    mockPreferenceManager.expects('getPreference').once().returns({ username: 'root' });
    const evalOptions = await evalInput.getInput(null, {
      l: 'test3',
      lang: 'java',
      i: '12345',
    });
    evalOptions.should.deep.equal({ ...mockOptions, idNo: '12345' });
  });
});

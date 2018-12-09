const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const inquirer = require('inquirer');
const evalInput = require('../../../../../lib/cli/input/eval');
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

const sandbox = sinon.createSandbox();

describe('for eval getInput', function () {
  afterEach(function () {
    sandbox.restore();
  });

  it('should return promise with correct values when flags provided', testEvalFlags);
  it('should return promise with correct values when flags not provided', testEvalNoFlags);
  it('should not accept empty getInput', testEmptyInput);
  it('should return id provided in options for root user', testRootUser);
});

async function testEvalFlags() {
  const mockPreferenceManager = sandbox.mock(preferenceManager);
  mockPreferenceManager.expects('getPreference').once().returns({ username: 'testuser' });
  const evalOptions = await evalInput.getInput(null, {
    l: 'test3',
    lang: 'java',
  });
  evalOptions.should.deep.equal(mockOptions);
}

function testEvalNoFlags() {
  const mockInquirer = sandbox.mock(inquirer);
  mockInquirer.expects('prompt').resolves(mockOptions);

  return evalInput.getInput(null, { l: 'test3', lang: 'cpp15' }).should.eventually.deep.equal(mockOptions);
}

async function testEmptyInput() {
  let promptStub;
  function invalidInputTester() {
    const prompt = promptStub.getCalls()[0].args[0][0];
    const emptyLabPrompt = prompt.validate('');
    emptyLabPrompt.should.equal('Please enter the lab name');
    const validLab = prompt.validate('test3');
    validLab.should.equal(true);
    return mockOptions;
  }

  promptStub = sandbox.stub(inquirer, 'prompt').callsFake(invalidInputTester);
  await evalInput.getInput(null, {});
}

async function testRootUser() {
  const mockPreferenceManager = sandbox.mock(preferenceManager);
  mockPreferenceManager.expects('getPreference').once().returns({ username: 'root' });
  const evalOptions = await evalInput.getInput(null, {
    l: 'test3',
    lang: 'java',
    i: '12345',
  });
  evalOptions.should.deep.equal({ ...mockOptions, idNo: '12345' });
}

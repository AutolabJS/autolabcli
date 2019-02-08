const inquirer = require('inquirer');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);
chai.should();

const showInput = require('../../../../../lib/cli/input/show');

chai.use(chaiAsPromised);
chai.should();

const sandbox = sinon.createSandbox();

describe('For show input', function () {
  afterEach(function () {
    sandbox.restore();
  });

  it('should send right event when requested for status', testShowStatus);
  it('should send right event when requested for score', testShowScore);
  it('should prompt when lab is not given for requesting score', testShowScorePrompt);
  it('should send the appropriate message for invalid show commmand', testInvalidCommand);
});

async function testShowStatus() {
  const ret = await showInput.getInput({ statistic: 'status' }, {});
  ret.should.deep.equal({
    name: 'status',
  });
}

async function testShowScore() {
  const ret = await showInput.getInput({ statistic: 'score' }, { l: 'Lab1', i: 'java_user' });
  ret.should.deep.equal({
    name: 'score',
    details: {
      lab: 'Lab1',
      id: 'java_user',
    },
  });
}

async function testShowScorePrompt() {
  const mockInquirer = sandbox.mock(inquirer);
  mockInquirer.expects('prompt').resolves({
    lab: 'Lab1',
    id: 'java_user',
  });
  const ret = await showInput.getInput({ statistic: 'score' }, {});
  ret.should.deep.equal({
    name: 'score',
    details: {
      lab: 'Lab1',
      id: 'java_user',
    },
  });
}

async function testInvalidCommand() {
  const ret = await showInput.getInput({ statistic: 'none' }, {});
  ret.should.deep.equal({
    name: 'invalid_command',
  });
}

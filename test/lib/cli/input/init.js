const initInput = require('../../../../lib/cli/input/init');
const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
chai.should();

mockUser = {u: 'testuser', p:'123'};

describe('for getInput', () => {

  let stdin;

  beforeEach(() => {
    stdin = require('mock-stdin').stdin();
  });

  it('should return promise with correct values when flags provided', () => {
    return initInput.getInput(null, mockUser).should.eventually.deep.equal({
      username: mockUser.u,
      password: mockUser.p
    });
  });

  it('should return promise with correct values when flags not provided', () => {
    process.nextTick(() => {
      stdin.send(['testuser2', '123']);
      return initInput.getInput(null, {}).should.eventually.deep.equal({
        username: 'testuser2',
        password: '123'
      });
    });

  });

});

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

  afterEach(() => {
    stdin.restore();
  })

  it('should return promise with correct values when flags provided', () => {
    return initInput.getInput(null, mockUser).should.eventually.deep.equal({
      username: mockUser.u,
      password: mockUser.p
    });
  });

  it('should return promise with correct values when flags not provided', () => {
    setTimeout(() => stdin.send('testuser2\n'), 1);
    setTimeout(() => stdin.send('123\n'), 2);

    return initInput.getInput(null, {}).should.eventually.deep.equal({
      username: 'testuser2',
      password: '123'
    });;

  });

  it('should not accept empty getInput', () => {
    setTimeout(() => stdin.send('\n'), 1);
    setTimeout(() => stdin.send('testuser2\n'), 2);
    setTimeout(() => stdin.send('\n'), 3);
    setTimeout(() => stdin.send('123\n'), 4);

    return initInput.getInput(null, {}).should.eventually.deep.equal({
      username: 'testuser2',
      password: '123'
    });;

  });

});

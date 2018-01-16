const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");

const initOutput = require('../../../../lib/cli/output/init');

const { expect } = chai;

chai.use(sinonChai);
chai.should();

describe('For init output', () => {
  it('log out the expected string', () => {
    const logSpy = sinon.spy(console, 'log');
    const outputString = 'Your username is: testuser\nYour password is: 123';
    initOutput.send(outputString);
    expect(logSpy).to.have.been.calledWith(outputString);
  });
});

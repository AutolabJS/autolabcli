const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");

const initModel = require('../../../lib/model/init');

chai.use(chaiAsPromised);
chai.should();

describe('for initModel', () =>{
  it('should get the required output string', () => {
    return initModel.getOutputString('testuser1', '123').should.eventually
      .equal('Your username is: testuser1\nYour password is: 123');
  });
});

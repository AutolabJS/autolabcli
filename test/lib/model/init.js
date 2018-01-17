const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chalk = require('chalk');

const initModel = require('../../../lib/model/init');

chai.use(chaiAsPromised);
chai.should();

describe('for initModel', () =>{
  it('should get the required output string', () => {
    return initModel.getOutputString('testuser1', '123').should.eventually
      .equal(`Your username is: ${chalk.blue('testuser1')}\n\Your password is: ${chalk.red('123')}`);
  });
});

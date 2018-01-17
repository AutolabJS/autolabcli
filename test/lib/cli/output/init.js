const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chalk = require('chalk');
const figlet = require('figlet');

const initOutput = require('../../../../lib/cli/output/init');

const { expect } = chai;

chai.use(sinonChai);
chai.should();

describe('For init output', () => {

  const logSpy = sinon.spy(console, 'log');

  it('should send expected welcome text', () => {
    const figletSpy = sinon.spy(figlet, 'textSync');
    initOutput.sendWelcome();
    expect(logSpy).to.have.been.called;
    expect(figletSpy).to.have.been.deep.calledWith('Autolab CLI', { horizontalLayout: 'full' });
  });

  it('should log out the expected string', () => {
    const outputString = `Your username is: ${chalk.blue('testuser1')}\nYour password is: ${chalk.red('123')}`;
    initOutput.sendResult('testuser1', '123');
    expect(logSpy).to.have.been.calledWith(outputString);
  });
});

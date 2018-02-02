const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const { exec } = require('child_process');
const path = require('path');
const figlet = require('figlet');
const chalk = require('chalk');
const controller = require('../../lib/controller');

chai.use(sinonChai);
chai.should();

describe('For init command', () => {

  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  it('should have ouptput as expected when init command is provided with flags', (done) => {
    exec('autolabjs init -u testuser1 -p 123', (err, stdout, stderr) => {
      let outputString = figlet.textSync('Autolab CLI', { horizontalLayout: 'full' });
      outputString += '\n' + 'Your username is: testuser1\nYour password is: 123\n';
      stdout.should.equal(outputString);
      done();
    });
  });

  it('should have ouptput as expected when init command is NOT provided with flags', (done) => {
    const stdin = require('mock-stdin').stdin();
    const logSpy = sandbox.spy(console, 'log');
    process.argv = [ '/usr/local/nodejs/bin/node',
      '/usr/local/nodejs/bin/autolab', 'init' ];

    controller.start();
    setTimeout(() => stdin.send('testuser1\n'), 1);
    setTimeout(() => stdin.send('123\n'), 2);
    setTimeout(() => {
      let outputString = chalk.yellow(figlet.textSync('Autolab CLI', { horizontalLayout: 'full' }));
      logSpy.should.have.been.calledWith(outputString);
      outputString = `Your username is: ${chalk.blue('testuser1')}\nYour password is: ${chalk.red('123')}`;
      logSpy.should.to.have.been.calledWith(outputString);
      done();
    },3);

  });

});

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chalk = require('chalk');
const Table = require('cli-table');

const prefsOutput = require('../../../../lib/cli/output/prefs');

chai.use(sinonChai);
chai.should();

describe('For prefs output', () => {

  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });


  it('should send expected output when language is changed', () => {
    const logStub = sandbox.stub(console, 'log');

    prefsOutput.sendOutput({name: 'lang_changed', details:{lang: 'cpp'}});
    logStub.should.have.been.calledWith(chalk.green(`Your submission language has been chaged to cpp`));
  });

  it('should send expected output when server is changed', () => {
    const logStub = sandbox.stub(console, 'log');

    prefsOutput.sendOutput({name: 'server_changed', details:{host: 'abc', port: '8999'}});
    logStub.should.have.been.calledWith(chalk.green(`Your submission server has been chaged to abc at port 8999`));
  });

  it('should send expected output when no url is provided', () => {
    const logStub = sandbox.stub(console, 'log');

    prefsOutput.sendOutput({name: 'no_url'});
    logStub.should.have.been.calledWith(chalk.red(`Please provide the url of the new server`));
  });

  it('should send expected output when invalid port is provided', () => {
    const logStub = sandbox.stub(console, 'log');

    prefsOutput.sendOutput({name: 'invalid_port'});
    logStub.should.have.been.calledWith(chalk.red(`Please provide the a valid port of the new server`));
  });

  it('should draw table for show prefs command', () => {
    const logStub = sandbox.stub(console, 'log');

    prefsOutput.sendOutput({
      name: 'show_prefs',
      details: {
        lang: 'python2',
        mainserver_host: 'fdsf@fsd.com',
        mainserver_port: 5235
      }
    });

    const table = new Table({
        head: [chalk.cyan('Preferences'), chalk.cyan('Values')]
      , colWidths: [15, 25]
    });
    table.push(
      ['Language', 'python2'],
      ['Server url', 'fdsf@fsd.com'],
      ['Server port', 5235]
    );

    logStub.should.have.been.calledWith(table.toString());
  });

});

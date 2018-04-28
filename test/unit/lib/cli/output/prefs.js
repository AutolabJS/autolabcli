const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chalk = require('chalk');
const Table = require('cli-table');
const path = require('path');

const prefsOutput = require('../../../../../lib/cli/output/prefs');

const defaultPrefPath = path.join(__dirname, '../../../../../default-prefs.json');
const defaultPrefs = JSON.parse(require('fs').readFileSync(defaultPrefPath, 'utf8'));

const { supportedLanguages } = defaultPrefs;

chai.use(sinonChai);
chai.should();

describe('For prefs output', () => {
  const sandbox = sinon.createSandbox();

  it('should send expected output when language is changed', () => {
    const logStub = sandbox.stub(console, 'log');

    prefsOutput.sendOutput({ name: 'lang_changed', details: { lang: 'cpp' } });
    logStub.should.have.been.calledWith(chalk.green('Your submission language has been changed to cpp'));

    sandbox.restore();
  });

  it('should send expected output when main server is changed', () => {
    const logStub = sandbox.stub(console, 'log');

    prefsOutput.sendOutput({ name: 'server_changed', details: { type: 'ms', host: 'abc', port: '8999' } });
    logStub.should.have.been.calledWith(chalk.green('Your main server has been changed to abc at port 8999'));

    sandbox.restore();
  });

  it('should send expected output when gitlab server is changed', () => {
    const logStub = sandbox.stub(console, 'log');

    prefsOutput.sendOutput({ name: 'server_changed', details: { type: 'gitlab', host: 'abc.com' } });
    logStub.should.have.been.calledWith(chalk.green('Your gitlab server has been changed to abc.com'));

    sandbox.restore();
  });

  it('should send expected output when no host is provided', () => {
    const logStub = sandbox.stub(console, 'log');

    prefsOutput.sendOutput({ name: 'invalid_host' });
    logStub.should.have.been.calledWith(chalk.red('Please provide a valid host'));

    sandbox.restore();
  });

  it('should send expected output when invalid port is provided', () => {
    const logStub = sandbox.stub(console, 'log');

    prefsOutput.sendOutput({ name: 'invalid_port' });
    logStub.should.have.been.calledWith(chalk.red('Please provide a valid port'));

    sandbox.restore();
  });

  it('should send expected output when invalid language is provided', () => {
    const logStub = sandbox.stub(console, 'log');

    prefsOutput.sendOutput({ name: 'invalid_lang', details: { supportedLanguages } });
    logStub.should.have.been.calledWith(chalk.red(`Please provide the a valid language. The supported languages are ${supportedLanguages}`));

    sandbox.restore();
  });

  it('should draw table for show prefs command', () => {
    const logStub = sandbox.stub(console, 'log');

    prefsOutput.sendOutput({
      name: 'show_prefs',
      details: {
        gitlab_host: 'xyz.com',
        mainserver_host: 'fdsf@fsd.com',
        mainserver_port: 5235,
      },
    });

    const table = new Table({
      head: [chalk.cyan('Preferences'), chalk.cyan('Values')],
      colWidths: [20, 25],
    });
    table.push(
      ['Gitlab host', 'xyz.com'],
      ['Main Server host', 'fdsf@fsd.com'],
      ['Main Server port', 5235],
    );

    logStub.should.have.been.calledWith(table.toString());

    sandbox.restore();
  });
});

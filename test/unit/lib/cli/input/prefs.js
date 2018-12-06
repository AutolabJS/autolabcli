const inquirer = require('inquirer');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const path = require('path');
const fs = require('fs');

chai.use(sinonChai);
chai.should();

const prefsInput = require('../../../../../lib/cli/input/prefs');
const preferenceManager = require('../../../../../lib/utils/preference-manager');

const defaultPrefPath = path.join(__dirname, '../../../../../default-prefs.json');
const defaultPrefs = JSON.parse(fs.readFileSync(defaultPrefPath, 'utf8'));

const { supportedLanguages } = defaultPrefs;

chai.use(chaiAsPromised);
chai.should();

const sandbox = sinon.createSandbox();

describe('for prefs input', function () {
  afterEach(function () {
    sandbox.restore();
  });

  it('should send the right event when language is changed using prompt', testLangChangePrompt);
  it('should send the right event when language is changed using lang flag', testLangChangeFlag);
  it('should send the right event when invalid language is provided using lang flag', testInvalidLang);
  it('should prompt when type of the server is not provided', testServerTypePrompt);
  it('should send the right event when main server is changed', testChangeMainServer);
  it('should send the right event when gitlab server is changed', testGitlabChanged);
  it('should prompt when host is not given for changing main server', testMSHostPrompt);
  it('should prompt when host is not given for changing gitlab server', testGitlabHostPrompt);
  it('should send the appropriate message when invalid host is given for main server', testMSInvalidHost);
  it('should send the appropriate message when invalid host is given for gitlab server', testGitlabInvalidHost);
  it('should send the appropriate message when invalid port is given', testInvalidPort);
  it('should send the appropriate message when invalid server is given', testInvalidServer);
  it('should send the right event when logger prefs are changed', testLoggerPrefs);
  it('should prompt when logger prefs are not given, blacklist', testLoggerBlacklistPrompt);
  it('should prompt when logger prefs are not given, maxsize', testLoggerMaxsizePrompt);
  it('should send the appropriate message when invalid keyword is given', testInvalidKeyword);
  it('should send the appropriate message  for show argument', testShowPrefs);
  it('should send the appropriate message for invalid prefs commmand', testInvalidCommand);
});

async function testLangChangePrompt() {
  const mockInquirer = sandbox.mock(inquirer);
  mockInquirer.expects('prompt').resolves({ lang: 'cpp14' });
  const ret = await prefsInput.getInput({ preference: 'changelang' }, { lang: null });
  ret.should.deep.equal({
    name: 'lang_changed',
    details: {
      lang: 'cpp14',
    },
  });
}

async function testLangChangeFlag() {
  const ret = await prefsInput.getInput({ preference: 'changelang' }, { lang: 'cpp' });
  ret.should.deep.equal({
    name: 'lang_changed',
    details: {
      lang: 'cpp',
    },
  });
}

async function testInvalidLang() {
  const ret = await prefsInput.getInput({ preference: 'changelang' }, { lang: 'python4' });
  ret.should.deep.equal({
    name: 'invalid_lang',
    details: {
      supportedLanguages,
    },
  });
}

async function testServerTypePrompt() {
  const mockInquirer = sandbox.mock(inquirer);
  mockInquirer.expects('prompt').resolves({ type: 'ms' });
  const ret = await prefsInput.getInput({
    preference: 'changeserver',
  }, { host: 'abc.com', port: '5555' });
  ret.should.deep.equal({
    name: 'server_changed',
    details: {
      type: 'ms',
      host: 'abc.com',
      port: '5555',
    },
  });
}

async function testChangeMainServer() {
  const ret = await prefsInput.getInput({
    preference: 'changeserver',
  }, {
    type: 'ms',
    host: 'abc.com',
    port: '5555',
  });
  ret.should.deep.equal({
    name: 'server_changed',
    details: {
      type: 'ms',
      host: 'abc.com',
      port: '5555',
    },
  });
}

async function testGitlabChanged() {
  const ret = await prefsInput.getInput({
    preference: 'changeserver',
  }, {
    type: 'gitlab',
    host: 'abc.com',
  });
  ret.should.deep.equal({
    name: 'server_changed',
    details: {
      type: 'gitlab',
      host: 'abc.com',
    },
  });
}

async function testMSHostPrompt() {
  const mockInquirer = sandbox.mock(inquirer);
  mockInquirer.expects('prompt').resolves({ host: 'abc.com', port: '5555' });
  const ret = await prefsInput.getInput({
    preference: 'changeserver',
  }, { type: 'ms', port: '5555' });
  ret.should.deep.equal({
    name: 'server_changed',
    details: {
      type: 'ms',
      host: 'abc.com',
      port: '5555',
    },
  });
}

async function testGitlabHostPrompt() {
  const mockInquirer = sandbox.mock(inquirer);
  mockInquirer.expects('prompt').resolves({ host: 'abc.com' });
  const ret = await prefsInput.getInput({
    preference: 'changeserver',
  }, { type: 'gitlab' });
  ret.should.deep.equal({
    name: 'server_changed',
    details: {
      type: 'gitlab',
      host: 'abc.com',
    },
  });
}

async function testMSInvalidHost() {
  const ret = await prefsInput.getInput({
    preference: 'changeserver',
  }, {
    type: 'ms',
    host: 'abc',
    port: '555',
  });
  ret.should.deep.equal({
    name: 'invalid_host',
  });
}

async function testGitlabInvalidHost() {
  const ret = await prefsInput.getInput({
    preference: 'changeserver',
  }, {
    type: 'gitlab',
    host: 'abc',
  });
  ret.should.deep.equal({
    name: 'invalid_host',
  });
}

async function testInvalidPort() {
  const ret = await prefsInput.getInput({
    preference: 'changeserver',
  }, {
    type: 'ms',
    host: 'abc.com',
    port: '555a',
  });
  ret.should.deep.equal({
    name: 'invalid_port',
  });
}

async function testInvalidServer() {
  const ret = await prefsInput.getInput({
    preference: 'changeserver',
  }, {
    type: 'github',
  });
  ret.should.deep.equal({
    name: 'invalid_server',
    details: {
      supportedServers: ['ms', 'gitlab'],
    },
  });
}

async function testLoggerPrefs() {
  const testSize = 65759;
  const ret = await prefsInput.getInput({
    preference: 'logger',
  }, {
    blacklist: 'adder',
    maxsize: testSize,
  });
  ret.should.deep.equal({
    name: 'logger_pref_changed',
    details: {
      keyword: 'adder',
      maxSize: testSize,
    },
  });
}

async function testLoggerBlacklistPrompt() {
  const mockInquirer = sandbox.stub(inquirer, 'prompt');
  mockInquirer.onCall(0).returns({ type: 'blacklist' });
  mockInquirer.onCall(1).returns({ keyword: 'abc' });

  const ret = await prefsInput.getInput({
    preference: 'logger',
  }, { });
  ret.should.deep.equal({
    name: 'logger_pref_changed',
    details: {
      keyword: 'abc',
    },
  });
}

async function testLoggerMaxsizePrompt() {
  const mockInquirer = sandbox.stub(inquirer, 'prompt');
  const testSize = 723000;
  mockInquirer.onCall(0).returns({ type: 'maxsize' });
  mockInquirer.onCall(1).returns({ maxsize: testSize });

  const ret = await prefsInput.getInput({
    preference: 'logger',
  }, { });
  ret.should.deep.equal({
    name: 'logger_pref_changed',
    details: {
      maxSize: testSize,
    },
  });
}

async function testInvalidKeyword() {
  const mockpreferenceManager = sandbox.mock(preferenceManager);
  mockpreferenceManager.expects('getPreference').withExactArgs({ name: 'cliPrefs' }).returns({
    logger: {
      blacklist: ['xyz'],
    },
  });
  const ret = await prefsInput.getInput({
    preference: 'logger',
  }, {
    blacklist: 'xyz',
  });
  ret.should.deep.equal({
    name: 'invalid_blacklist_keyword',
  });
}

async function testShowPrefs() {
  const ret = await prefsInput.getInput({
    preference: 'show',
  });
  ret.should.deep.equal({
    name: 'show_prefs',
  });
}

async function testInvalidCommand() {
  const ret = await prefsInput.getInput({
    preference: 'modifyprefs',
  });
  ret.should.deep.equal({
    name: 'invalid_command',
  });
}

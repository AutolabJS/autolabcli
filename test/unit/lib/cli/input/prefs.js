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

const testLangChangePrompt = async () => {
  const mockInquirer = sandbox.mock(inquirer);
  mockInquirer.expects('prompt').resolves({ lang: 'cpp14' });
  const ret = await prefsInput.getInput({ preference: 'changelang' }, { lang: null });
  ret.should.deep.equal({
    name: 'lang_changed',
    details: {
      lang: 'cpp14',
    },
  });
};

const testLangChangeFlag = async () => {
  const ret = await prefsInput.getInput({ preference: 'changelang' }, { lang: 'cpp' });
  ret.should.deep.equal({
    name: 'lang_changed',
    details: {
      lang: 'cpp',
    },
  });
};

const testInvalidLang = async () => {
  const ret = await prefsInput.getInput({ preference: 'changelang' }, { lang: 'python4' });
  ret.should.deep.equal({
    name: 'invalid_lang',
    details: {
      supportedLanguages,
    },
  });
};

const testServerTypePrompt = async () => {
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
};

const testChangeMainServer = async () => {
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
};

const testGitlabChanged = async () => {
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
};

const testMSHostPrompt = async () => {
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
};

const testGitlabHostPrompt = async () => {
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
};

const testMSInvalidHost = async () => {
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
};

const testGitlabInvalidHost = async () => {
  const ret = await prefsInput.getInput({
    preference: 'changeserver',
  }, {
    type: 'gitlab',
    host: 'abc',
  });
  ret.should.deep.equal({
    name: 'invalid_host',
  });
};

const testInvalidPort = async () => {
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
};

const testLoggerPrefs = async () => {
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
};

const testLoggerBlacklistPrompt = async () => {
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
};

const testLoggerMaxsizePrompt = async () => {
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
};

const testInvalidKeyword = async () => {
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
    name: 'invalid_logger_prefs',
  });
};

const testShowPrefs = async () => {
  const ret = await prefsInput.getInput({
    preference: 'show',
  });
  ret.should.deep.equal({
    name: 'show_prefs',
  });
};

describe('for prefs input', () => {
  afterEach(() => {
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
  it('should send the right event when logger prefs are changed', testLoggerPrefs);
  it('should prompt when logger prefs are not given, blacklist', testLoggerBlacklistPrompt);
  it('should prompt when logger prefs are not given, maxsize', testLoggerMaxsizePrompt);
  it('should send the appropriate message when invalid keyword is given', testInvalidKeyword);
  it('should send the appropriate message  for show argument', testShowPrefs);
});

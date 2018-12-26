const inquirer = require('inquirer');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);
chai.should();

const prefsInput = require('../../../../../lib/cli/input/prefs');

chai.use(chaiAsPromised);
chai.should();

const sandbox = sinon.createSandbox();

describe('for prefs input', function () {
  afterEach(function () {
    sandbox.restore();
  });

  it('should send the right event when language is changed using prompt', testLangChangePrompt);
  it('should send the right event when language is changed using lang flag', testLangChangeFlag);
  it('should prompt when type of the server is not provided', testServerTypePrompt);
  it('should send the right event when main server is changed', testChangeMainServer);
  it('should send the right event when gitlab server is changed', testGitlabChanged);
  it('should prompt when host is not given for changing main server', testMSHostPrompt);
  it('should prompt when host is not given for changing gitlab server', testGitlabHostPrompt);
  it('should send the right event when differnt server is changed', testDefaultServer);
  it('should send the right event when logger prefs are changed', testLoggerPrefs);
  it('should prompt when logger prefs are not given, blacklist', testLoggerBlacklistPrompt);
  it('should prompt when logger prefs are not given, maxsize', testLoggerMaxsizePrompt);
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

async function testDefaultServer() {
  const ret = await prefsInput.getInput({
    preference: 'changeserver',
  }, {
    type: 'github',
    host: 'abc.com',
    port: '4849',
  });
  ret.should.deep.equal({
    name: 'server_changed',
    details: {
      type: 'github',
      host: 'abc.com',
      port: '4849',
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

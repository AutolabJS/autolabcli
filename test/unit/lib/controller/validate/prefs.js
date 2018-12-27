const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const path = require('path');
const fs = require('fs');

chai.use(sinonChai);
chai.should();

const prefsValidator = require('../../../../../lib/controller/validate/prefs');
const preferenceManager = require('../../../../../lib/utils/preference-manager');

const defaultPrefPath = path.join(__dirname, '../../../../../default-prefs.json');
const defaultPrefs = JSON.parse(fs.readFileSync(defaultPrefPath, 'utf8'));

const { supportedLanguages } = defaultPrefs;

chai.use(chaiAsPromised);
chai.should();

const sandbox = sinon.createSandbox();

describe('for prefs validate', function () {
  afterEach(function () {
    sandbox.restore();
  });

  it('should sent the right event when language changed is valid', testValidLanguage);
  it('should sent the right event when language changed is invalid', testInvalidLanguage);
  it('should send the right event when valid server properties changed', testValidServer);
  it('should send the right event when invalid host is given for main server', testMSInvalidHost);
  it('should send the right event when invalid host is given for gitlab server', testGitlabInvalidHost);
  it('should send the right event when invalid port is given', testInvalidPort);
  it('should send the right event when invalid server is given', testInvalidServer);
  it('should send the right event when valid logger properties changed', testValidLogger);
  it('should send the right event when invalid keyword is given', testInvalidKeyword);
  it('should send the event back on default event', testDefaultEvent);
});

function testValidLanguage(done) {
  const prefsChangedEvent = {
    name: 'lang_changed',
    details: {
      lang: supportedLanguages[0],
    },
  };
  const ret = prefsValidator.validate(prefsChangedEvent);
  ret.should.deep.equal(prefsChangedEvent);
  done();
}

function testInvalidLanguage(done) {
  const prefsChangedEvent = {
    name: 'lang_changed',
    details: {
      lang: 'julia',
    },
  };
  const ret = prefsValidator.validate(prefsChangedEvent);
  ret.should.deep.equal({
    name: 'invalid_lang',
    details: {
      supportedLanguages,
    },
  });
  done();
}

function testValidServer(done) {
  const prefsChangedEvent = {
    name: 'server_changed',
    details: {
      host: 'abc.com',
      port: '8999',
      type: 'ms',
    },
  };
  const ret = prefsValidator.validate(prefsChangedEvent);
  ret.should.deep.equal(prefsChangedEvent);
  done();
}

function testMSInvalidHost(done) {
  const ret = prefsValidator.validate({
    name: 'server_changed',
    details: {
      host: 'abc',
      port: '8999',
      type: 'ms',
    },
  });
  ret.should.deep.equal({
    name: 'invalid_host',
  });
  done();
}

function testGitlabInvalidHost(done) {
  const ret = prefsValidator.validate({
    name: 'server_changed',
    details: {
      host: 'abc',
      port: '8999',
      type: 'gitlab',
    },
  });
  ret.should.deep.equal({
    name: 'invalid_host',
  });
  done();
}

function testInvalidPort(done) {
  const ret = prefsValidator.validate({
    name: 'server_changed',
    details: {
      host: 'abc.com',
      port: '822a',
      type: 'gitlab',
    },
  });
  ret.should.deep.equal({
    name: 'invalid_port',
  });
  done();
}

function testInvalidServer(done) {
  const ret = prefsValidator.validate({
    name: 'server_changed',
    details: {
      host: 'abc.com',
      port: '822',
      type: 'github',
    },
  });
  ret.should.deep.equal({
    name: 'invalid_server',
    details: {
      supportedServers: ['ms', 'gitlab'],
    },
  });
  done();
}

async function testValidLogger() {
  const mockpreferenceManager = sandbox.mock(preferenceManager);
  mockpreferenceManager.expects('getPreference').withExactArgs({ name: 'cliPrefs' }).returns({
    logger: {
      blacklist: ['abc'],
    },
  });
  const changedPrefsEvent = {
    name: 'logger_pref_changed',
    details: {
      keyword: 'xyz',
      maxSize: '448749',
    },
  };
  const ret = prefsValidator.validate(changedPrefsEvent);
  ret.should.deep.equal(changedPrefsEvent);
}

async function testInvalidKeyword() {
  const mockpreferenceManager = sandbox.mock(preferenceManager);
  mockpreferenceManager.expects('getPreference').withExactArgs({ name: 'cliPrefs' }).returns({
    logger: {
      blacklist: ['xyz'],
    },
  });
  const ret = prefsValidator.validate({
    name: 'logger_pref_changed',
    details: {
      keyword: 'xyz',
    },
  });
  ret.should.deep.equal({
    name: 'invalid_blacklist_keyword',
  });
}

function testDefaultEvent(done) {
  const ret = prefsValidator.validate({
    name: 'invalid_prefs',
  });
  ret.should.deep.equal({
    name: 'invalid_prefs',
  });
  done();
}

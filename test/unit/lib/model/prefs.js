const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);
chai.should();

const preferenceManager = require('../../../../lib/utils/preference-manager');
const prefsModel = require('../../../../lib/model/prefs');

chai.use(chaiAsPromised);
chai.should();

describe('for prefsModel', function () {
  it('should change the language', testChangeLang);
  it('should change the gitlab server', testChangeGitlabServer);
  it('should change the main server', testChangeMainServer);
  it('should change the logger file size', testChangeLoggerFileSize);
  it('should change the logger blacklists', testChangeLoggerBlacklist);
  it('should send the stored preferences on show', testShowPrefs);
});

async function testChangeLang() {
  const mockPreferenceManager = sinon.mock(preferenceManager);
  mockPreferenceManager.expects('setPreference').withExactArgs({
    name: 'cliPrefs',
    values: {
      submission: {
        language: 'python3',
      },
    },
  });

  prefsModel.storePrefs({
    name: 'lang_changed',
    details: {
      lang: 'python3',
    },
  });

  mockPreferenceManager.verify();
}

async function testChangeGitlabServer() {
  const mockPreferenceManager = sinon.mock(preferenceManager);
  mockPreferenceManager.expects('setPreference').withExactArgs({
    name: 'cliPrefs',
    values: {
      gitlab: {
        host: 'abc.com',
      },
    },
  });

  prefsModel.storePrefs({
    name: 'server_changed',
    details: {
      type: 'gitlab',
      host: 'abc.com',
    },
  });

  mockPreferenceManager.verify();
}

async function testChangeMainServer() {
  const mockPreferenceManager = sinon.mock(preferenceManager);
  const testMsPort = 3333;
  mockPreferenceManager.expects('setPreference').withExactArgs({
    name: 'cliPrefs',
    values: {
      main_server: {
        host: 'abc',
        port: testMsPort,
      },
    },
  });

  prefsModel.storePrefs({
    name: 'server_changed',
    details: {
      type: 'ms',
      host: 'abc',
      port: testMsPort,
    },
  });

  mockPreferenceManager.verify();
}

async function testChangeLoggerFileSize() {
  const mockPreferenceManager = sinon.mock(preferenceManager);
  const testSize = 72000;
  mockPreferenceManager.expects('setPreference').withExactArgs({
    name: 'loggerPrefs',
    values: {
      logger: {
        blacklist: {
          keyword: undefined,
        },
        maxSize: testSize,
      },
    },
  });

  prefsModel.storePrefs({
    name: 'logger_pref_changed',
    details: {
      maxSize: testSize,
    },
  });

  mockPreferenceManager.verify();
}

async function testChangeLoggerBlacklist() {
  const mockPreferenceManager = sinon.mock(preferenceManager);
  mockPreferenceManager.expects('setPreference').withExactArgs({
    name: 'loggerPrefs',
    values: {
      logger: {
        blacklist: {
          keyword: 'xyz',
        },
        maxSize: NaN,
      },
    },
  });

  prefsModel.storePrefs({
    name: 'logger_pref_changed',
    details: {
      keyword: 'xyz',
    },
  });

  mockPreferenceManager.verify();
}

async function testShowPrefs() {
  const mockPreferenceManager = sinon.mock(preferenceManager);
  const testSize = 52457;
  const testMsPort = 3333;
  mockPreferenceManager.expects('getPreference').withExactArgs({ name: 'cliPrefs' }).returns({
    submission: {
      language: 'java',
    },
    main_server: {
      host: 'abc',
      port: testMsPort,
    },
    gitlab: {
      host: 'bcd.com',
    },
    logger: {
      maxSize: testSize,
      logDirectory: '.xys',
      logLocation: 'all.log',
      blacklist: ['log'],
    },
  });

  prefsModel.storePrefs({ name: 'show_prefs' });

  mockPreferenceManager.verify();
}

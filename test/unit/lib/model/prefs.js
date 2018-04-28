const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chalk = require('chalk');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);
chai.should();

const preferenceManager = require('../../../../lib/utils/preference-manager');
const prefsModel = require('../../../../lib/model/prefs');

chai.use(chaiAsPromised);
chai.should();

describe('for prefsModel', () => {
  it('should change the language', async () => {
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
  });

  it('should change the gitlab server', async () => {
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
  });

  it('should change the main server', async () => {
    const mockPreferenceManager = sinon.mock(preferenceManager);
    mockPreferenceManager.expects('setPreference').withExactArgs({
      name: 'cliPrefs',
      values: {
        main_server: {
          host: 'abc',
          port: 3333,
        },
      },
    });

    prefsModel.storePrefs({
      name: 'server_changed',
      details: {
        type: 'ms',
        host: 'abc',
        port: 3333,
      },
    });

    mockPreferenceManager.verify();
  });

  it('should send the stored preferences on show', async () => {
    const mockPreferenceManager = sinon.mock(preferenceManager);
    mockPreferenceManager.expects('getPreference').withExactArgs({ name: 'cliPrefs' }).returns({
      submission: {
        language: 'java',
      },
      main_server: {
        host: 'abc',
        port: 3333,
      },
      gitlab: {
        host: 'bcd.com',
      },
    });

    prefsModel.storePrefs({ name: 'show_prefs' });

    mockPreferenceManager.verify();
  });
});

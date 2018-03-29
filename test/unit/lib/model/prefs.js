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

  it('should call change the language', async () => {
    const mockPreferenceManager = sinon.mock(preferenceManager);
    mockPreferenceManager.expects('setPreference').withExactArgs({
      name: 'cliPrefs',
      values: {
        submission: {
          language: 'python3'
        }
      }
    });

    prefsModel.storePrefs({
      name: 'lang_changed',
      details: {
        lang: 'python3'
      }
    });

    mockPreferenceManager.verify();
  });

  it('should call change the server', async () => {
    const mockPreferenceManager = sinon.mock(preferenceManager);
    mockPreferenceManager.expects('setPreference').withExactArgs({
      name: 'cliPrefs',
      values: {
        main_server: {
          host: 'abc',
          port: 3333
        }
      }
    });

    prefsModel.storePrefs({
      name: 'server_changed',
      details: {
        host: 'abc',
        port: 3333
      }
    });

    mockPreferenceManager.verify();
  });

  it('should call show server', async () => {
    const mockPreferenceManager = sinon.mock(preferenceManager);
    mockPreferenceManager.expects('getPreference').withExactArgs({name: 'cliPrefs'}).returns({
      submission: {
        language: 'java'
      },
      main_server: {
          host: 'abc',
          port: 3333
      }
    });

    prefsModel.storePrefs({name: 'show_prefs'});

    mockPreferenceManager.verify();
  });

});

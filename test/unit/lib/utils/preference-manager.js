const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const Preferences = require('preferences');

const preferenceManager = require('../../../../lib/utils/preference-manager');
const defaultPrefs = require('../../../../default-prefs.json');

const { submission } = defaultPrefs;
// eslint-disable-next-line camelcase
const { main_server } = defaultPrefs;
const { gitlab } = defaultPrefs;
const defaultLogger = defaultPrefs.logger;


chai.use(sinonChai);
chai.should();

const sandbox = sinon.createSandbox();

// eslint-disable-next-line max-lines-per-function
describe('for preference manager', function () {
  after(setPrefsDefaults);

  beforeEach(setPrefsDefaults);

  afterEach(function () {
    sandbox.restore();
  });

  it('should send an instance of Preferences on cliPrefs', testGetCliPrefs);
  it('should send an instance of Preferences on gitLabPrefs', testGetGitlabPrefs);
  it('should not send an instance of Preferences on any other', testInvalidPref);
  it('should update cliPrefs', testSetCliPrefs);
  it('should update gitLabPrefs', testSetGitlabPrefs);
  it('should update loggerPrefs; maxSize', testSetLoggerMaxSizePrefs);
  it('should update loggerPrefs; blacklist', testSetLoggerBlacklistPrefs);
});

function setPrefsDefaults() {
  preferenceManager.setPreference({
    name: 'cliPrefs',
    values: {
      main_server,
      submission,
      logger: { ...defaultLogger },
      gitlab,
    },
  });
  preferenceManager.deleteCredentials();
}

function testGetCliPrefs(done) {
  const cliPrefs = preferenceManager.getPreference({ name: 'cliPrefs' });
  cliPrefs.should.be.an.instanceOf(Preferences);
  done();
}

function testGetGitlabPrefs(done) {
  const gitLabPrefs = preferenceManager.getPreference({ name: 'gitLabPrefs' });
  gitLabPrefs.should.be.an.instanceOf(Preferences);
  done();
}

function testInvalidPref(done) {
  const invalidPrefs = preferenceManager.getPreference({ name: 'others' });
  invalidPrefs.should.not.be.an.instanceOf(Preferences);
  invalidPrefs.should.deep.equal({});
  done();
}

function testSetCliPrefs(done) {
  preferenceManager.setPreference({
    name: 'cliPrefs',
    values: {
      submission: {
        language: 'python3.5',
      },
    },
  });
  const cliPrefs = preferenceManager.getPreference({ name: 'cliPrefs' });
  cliPrefs.submission.language.should.equal('python3.5');
  done();
}

function testSetGitlabPrefs(done) {
  preferenceManager.setPreference({
    name: 'gitLabPrefs',
    values: {
      username: 'test2',
    },
  });
  const gitLabPrefs = preferenceManager.getPreference({ name: 'gitLabPrefs' });
  gitLabPrefs.should.deep.property('username', 'test2');
  done();
}

function testSetLoggerMaxSizePrefs(done) {
  const testSize = 674850;
  preferenceManager.setPreference({
    name: 'loggerPrefs',
    values: {
      logger: {
        maxSize: testSize,
      },
    },
  });
  const loggerPrefs = preferenceManager.getPreference({ name: 'cliPrefs' }).logger;
  loggerPrefs.should.deep.property('maxSize', testSize);
  done();
}

function testSetLoggerBlacklistPrefs(done) {
  preferenceManager.setPreference({
    name: 'loggerPrefs',
    values: {
      logger: {
        blacklist: {
          keyword: 'testkey',
        },
      },
    },
  });
  const loggerPrefs = preferenceManager.getPreference({ name: 'cliPrefs' }).logger;
  loggerPrefs.blacklist.should.include('testkey');
  done();
}

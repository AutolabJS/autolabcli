const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const Preferences = require('preferences');

const preferenceManager = require('../../../../lib/utils/preference-manager');

chai.use(sinonChai);
chai.should();

const sandbox = sinon.createSandbox();

describe('for preference manager', function () {
  before(function () {
    preferenceManager.setPreference('default');
  });

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
  cliPrefs.should.deep.property('submission', { language: 'python3.5' });
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

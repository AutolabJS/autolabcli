const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const Preferences = require('preferences');

const preferenceManager = require('../../../../lib/utils/preference-manager');

chai.use(sinonChai);
chai.should();

const sandbox = sinon.createSandbox();

const testGetCliPrefs = (done) => {
  const cliPrefs = preferenceManager.getPreference({ name: 'cliPrefs' });
  cliPrefs.should.be.an.instanceOf(Preferences);
  done();
};

const testGetGitlabPrefs = (done) => {
  const gitLabPrefs = preferenceManager.getPreference({ name: 'gitLabPrefs' });
  gitLabPrefs.should.be.an.instanceOf(Preferences);
  done();
};

const testInvalidPref = (done) => {
  const invalidPrefs = preferenceManager.getPreference({ name: 'others' });
  invalidPrefs.should.not.be.an.instanceOf(Preferences);
  invalidPrefs.should.deep.equal({});
  done();
};

const testSetCliPrefs = (done) => {
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
};

const testSetGitlabPrefs = (done) => {
  preferenceManager.setPreference({
    name: 'gitLabPrefs',
    values: {
      username: 'test2',
    },
  });
  const gitLabPrefs = preferenceManager.getPreference({ name: 'gitLabPrefs' });
  gitLabPrefs.should.deep.property('username', 'test2');
  done();
};

const testSetLoggerMaxSizePrefs = (done) => {
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
};

const testSetLoggerBlacklistPrefs = (done) => {
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
};


describe('for preference manager', () => {
  before(() => {
    preferenceManager.setPreference('default');
  });

  afterEach(() => {
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

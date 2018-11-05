const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const nock = require('nock');
const controller = require('../../lib/controller');
const preferenceManager = require('../../lib/utils/preference-manager');
const { logger } = require('../../lib/utils/logger');

chai.use(sinonChai);
chai.should();

const login = async () => {
  process.argv = ['/usr/local/nodejs/bin/node',
    '/usr/local/nodejs/bin/autolabjs', 'init', '-u', 'testuser2', '-p', '123'];

  await controller.start();
};

const sandbox = sinon.createSandbox();

const testCredentialsDeleted = async () => {
  const logSpy = sandbox.stub(console, 'log');
  await login();

  process.argv = ['/usr/local/nodejs/bin/node',
    '/usr/local/nodejs/bin/autolab', 'exit'];
  await controller.start();

  preferenceManager.getPreference({ name: 'gitLabPrefs' }).privateToken.should.equal('');
  preferenceManager.getPreference({ name: 'gitLabPrefs' }).storedTime.should.equal(-1);
  logSpy.callCount.should.be.greaterThan(0);
  sandbox.restore();
};

describe('Integration test for exit command', () => {
  before(() => {
    logger.transports.forEach((t) => { t.silent = true; }); // eslint-disable-line no-param-reassign
  });

  beforeEach(() => {
    const fakeServer = nock('https://autolab.bits-goa.ac.in')
      .post('/api/v4/session?login=testuser2&password=123');

    const httpOK = 200;
    fakeServer.reply(httpOK, {
      ok: true,
      name: 'test_user2',
      private_token: 'zxcvbnb',
    });
  });

  it('should remove the stored credentials', testCredentialsDeleted);
});

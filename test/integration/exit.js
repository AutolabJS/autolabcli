const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const { exec } = require('child_process');
const chalk = require('chalk');
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

describe('Integration test for exit command', () => {
  const sandbox = sinon.createSandbox();

  before(() => {
    logger.transports.forEach((t) => { t.silent = true; });
  });

  beforeEach(() => {
    const fakeServer = nock('https://autolab.bits-goa.ac.in')
      .post('/api/v4/session?login=testuser2&password=123');
    fakeServer.reply(200, {
      ok: true,
      name: 'test_user2',
      private_token: 'zxcvbnb',
    });
  });

  it('should remove the stored credentials', async () => {
    const logSpy = sandbox.stub(console, 'log');
    await login();

    process.argv = ['/usr/local/nodejs/bin/node',
      '/usr/local/nodejs/bin/autolab', 'exit'];
    await controller.start();

    preferenceManager.getPreference({ name: 'gitLabPrefs' }).privateToken.should.equal('');
    preferenceManager.getPreference({ name: 'gitLabPrefs' }).storedTime.should.equal(-1);
    sandbox.restore();
  });
});

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const { exec } = require('child_process');
const chalk = require('chalk');
const nock = require('nock');
const controller = require('../../lib/controller');
const preferenceManager = require('../../lib/utils/preference-manager');

chai.use(sinonChai);
chai.should();

const login = () => {
  process.argv = [ '/usr/local/nodejs/bin/node',
    '/usr/local/nodejs/bin/autolab', 'init', '-u', 'testuser2', '-p', '123' ];

  controller.start();
}

describe('Integration test for exit command', () => {

  const sandbox = sinon.createSandbox();

  beforeEach(() => {
    const fakeServer = nock('https://autolab.bits-goa.ac.in')
                       .post('/api/v4/session?login=testuser2&password=123');
    fakeServer.reply(200, {
      ok: true,
      name: 'test_user2',
      private_token: 'zxcvbnb'
    });
  });


  afterEach(() => {
    sandbox.restore();
  });

  it('should remove the stored credentials', (done) => {

    const logSpy = sandbox.stub(console, 'log');
    login();

    setTimeout(() => {
      process.argv = [ '/usr/local/nodejs/bin/node',
        '/usr/local/nodejs/bin/autolab', 'exit' ];
      controller.start();
      preferenceManager.getPreference({name: 'gitLabPrefs'}).privateToken.should.equal('');
      preferenceManager.getPreference({name: 'gitLabPrefs'}).storedTime.should.equal(-1);
      done();
    },100);
  });

});

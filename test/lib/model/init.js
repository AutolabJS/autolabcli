const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chalk = require('chalk');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const nock = require('nock');

chai.use(sinonChai);
chai.should();

const preferenceManager = require('../../../lib/utils/preference-manager');
const initModel = require('../../../lib/model/init');

chai.use(chaiAsPromised);
chai.should();

describe('for initModel', () => {

  it('should return status code 200 after successful login', async () => {
    const fakeServer = nock('https://autolab.bits-goa.ac.in')
                       .post('/api/v4/session?login=testuser3&password=123');
    fakeServer.reply(200, {
      ok: true,
      name: 'test_user3',
      private_token: 'zxcvbnb'
    });

    let status = await initModel.authenticate({
      username: 'testuser3',
      password: '123'
    });
    status.code.should.equal(200);
    status.name.should.equal('test_user3');
    preferenceManager.getPreference({name: 'gitLabPrefs'}).privateToken.should.equal('zxcvbnb');
  });

  it('should return status code of 401 when invalid login provided', async () => {
    const fakeServer = nock('https://autolab.bits-goa.ac.in')
                  .post('/api/v4/session?login=testuser&password=123');
    fakeServer.reply(401);
    let status = await initModel.authenticate({
      username: 'testuser',
      password: '123'
    });
    status.code.should.equal(401);
  });

});

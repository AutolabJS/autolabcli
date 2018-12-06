const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);
chai.should();

const preferenceManager = require('../../../../lib/utils/preference-manager');
const exitModel = require('../../../../lib/model/exit');

chai.use(chaiAsPromised);
chai.should();

describe('for exitModel', function () {
  it('should call appropriate methods of preference manager', testPreferenceManagerCall);
});

async function testPreferenceManagerCall() {
  const mockPreferenceManager = sinon.mock(preferenceManager);
  mockPreferenceManager.expects('deleteCredentials').once();

  exitModel.logout();

  mockPreferenceManager.verify();
}

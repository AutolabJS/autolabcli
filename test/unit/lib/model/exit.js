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

const testPreferenceManagerCall = async () => {
  const mockPreferenceManager = sinon.mock(preferenceManager);
  mockPreferenceManager.expects('deleteCredentials').once();

  exitModel.logout();

  mockPreferenceManager.verify();
};

describe('for exitModel', () => {
  it('should call appropriate methods of preference manager', testPreferenceManagerCall);
});

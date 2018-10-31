const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const io = require('socket.io-client');

chai.use(sinonChai);
chai.should();

const { logger } = require('../../../../lib/utils/logger');
const preferenceManager = require('../../../../lib/utils/preference-manager');
const evalModel = require('../../../../lib/model/eval');

const mockOptions = {
  lab: 'test3',
  lang: 'java',
  idNo: 'testuser',
  commitHash: '',
};

const mockCliPref = {
  main_server: {
    host: 'abc.com',
    port: '8080',
  },
};

chai.use(chaiAsPromised);
chai.should();

describe('for evalModel', () => {
  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  it('should work as expected on scores event ', (done) => {
    let onScoresStub;


    let stub;
    const mockIo = sandbox.mock(io);
    const mocklogger = sandbox.stub(logger, 'log');
    const mockPreferenceManager = sandbox.mock(preferenceManager);
    mockPreferenceManager.expects('getPreference').returns(mockCliPref);
    const mockSocket = io('http://localhost:8080');
    mockIo.expects('connect').once().returns(mockSocket);
    const fakeonScores = () => {
      const cb = onScoresStub.getCalls()[0].args[1];
      cb({ status: 1 });
      stub.should.have.been.calledWith({
        name: 'scores',
        details: {
          status: 1,
        },
      });
      done();
    };

    onScoresStub = sandbox.stub(mockSocket, 'on').withArgs('scores').callsFake(fakeonScores);
    stub = sandbox.stub();
    evalModel.evaluate(mockOptions, stub);
    mockIo.verify();
    mockPreferenceManager.verify();
    mocklogger.called.should.equal(true);
  });

  it('should work as expected on invalid event ', (done) => {
    let onScoresStub;


    let stub;
    const mockIo = sandbox.mock(io);
    const mockSocket = io('http://localhost:8080');
    const mocklogger = sandbox.stub(logger, 'log');
    const mockPreferenceManager = sandbox.mock(preferenceManager);
    mockPreferenceManager.expects('getPreference').returns(mockCliPref);
    mockIo.expects('connect').once().returns(mockSocket);
    const fakeonScores = () => {
      const cb = onScoresStub.getCalls()[0].args[1];
      cb({ status: 1 });
      stub.should.have.been.calledWith({
        name: 'invalid',
      });
      done();
    };

    onScoresStub = sandbox.stub(mockSocket, 'on').withArgs('invalid').callsFake(fakeonScores);
    stub = sandbox.stub();
    evalModel.evaluate(mockOptions, stub);
    mockIo.verify();
    mockPreferenceManager.verify();
    mocklogger.called.should.equal(true);
  });

  it('should work as expected on submission_pending event ', (done) => {
    let onScoresStub;


    let stub;
    const mockIo = sandbox.mock(io);
    const mockSocket = io('http://localhost:8080');
    const mocklogger = sandbox.stub(logger, 'log');
    const mockPreferenceManager = sandbox.mock(preferenceManager);
    mockPreferenceManager.expects('getPreference').returns(mockCliPref);
    mockIo.expects('connect').once().returns(mockSocket);
    const fakeonScores = () => {
      const cb = onScoresStub.getCalls()[0].args[1];
      cb({ status: 1 });
      stub.should.have.been.calledWith({
        name: 'submission_pending',
      });
      done();
    };

    onScoresStub = sandbox.stub(mockSocket, 'on').withArgs('submission_pending').callsFake(fakeonScores);
    stub = sandbox.stub();
    evalModel.evaluate(mockOptions, stub);
    mockIo.verify();
    mockPreferenceManager.verify();
    mocklogger.called.should.equal(true);
  });
});

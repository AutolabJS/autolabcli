/* eslint-disable object-curly-newline */
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const nock = require('nock');

chai.use(sinonChai);
chai.should();

const preferenceManager = require('../../../../lib/utils/preference-manager');
const showModel = require('../../../../lib/model/show');
const { logger } = require('../../../../lib/utils/logger');

let host = 'autolab.bits-goa.ac.in';
let port = '9000';
if (preferenceManager.getPreference({ name: 'cliPrefs' }).main_server) {
  ({ host, port } = preferenceManager.getPreference({ name: 'cliPrefs' }).main_server);
}

chai.use(chaiAsPromised);
chai.should();

const sandbox = sinon.createSandbox();

describe('for showModel', function () {
  afterEach(function () {
    sandbox.restore();
  });

  it('should work for the show status event', testShowStatus);
  it('should send httpFailure 401 on status when request failed', testHttpError);
  it('should work for the show score event', testShowScore);
  it('should work for the show score event for a given student', testShowScoreStudent);
  // it('should send invalid lab message for the show score event for invalid lab', testInvalidLab);
  it('should send httpFailure 4 on score when network error', testHttpFailure);
  it('should work for any invalid event', testDefaultEvent);
});

// eslint-disable-next-line max-lines-per-function
function testShowStatus(done) {
  const mocklogger = sandbox.mock(logger).expects('log').atLeast(1);
  const callbackSpy = sandbox.spy();
  const testTimeout = 30;

  const testStatus = {
    components: [
      { role: 'execution_node', hostname: 'localhost', port: '8091', status: 'up' },
      { role: 'execution_node', hostname: 'localhost', port: '8092', status: 'up' },
      { role: 'load_balancer', hostname: 'localhost', port: '8081', maxLogLength: '256kb', cmd: 'log', status: 'up' },
    ],
    job_queue_length: 0,
    timestamp: 'Sun Feb 03 2019 04:44:16 GMT+0000 (Coordinated Universal Time)',
  };

  const fakeServer = nock(`https://${host}:${port}`)
    .get('/status');

  const httpOK = 200;

  fakeServer.reply(httpOK, testStatus);

  showModel.show({ name: 'status' }, callbackSpy);

  setTimeout(() => {
    callbackSpy.should.have.been.calledWithExactly({
      name: 'status',
      details: {
        status: testStatus,
      },
    });
    mocklogger.verify();
    done();
  }, testTimeout);
}

function testHttpError(done) {
  const mocklogger = sandbox.mock(logger).expects('log').atLeast(1);
  const callbackSpy = sandbox.spy();
  const testTimeout = 10;

  const fakeServer = nock(`https://${host}:${port}`)
    .get('/status');

  const httpUnauth = 401;

  fakeServer.reply(httpUnauth);

  showModel.show({ name: 'status' }, callbackSpy);

  setTimeout(() => {
    callbackSpy.should.have.been.calledWithExactly({
      name: 'httpFailure',
      details: {
        code: httpUnauth,
      },
    });
    mocklogger.verify();
    done();
  }, testTimeout);
}

// eslint-disable-next-line max-lines-per-function
function testShowScore(done) {
  const mocklogger = sandbox.mock(logger).expects('log').atLeast(1);
  const callbackSpy = sandbox.spy();
  const testTimeout = 20;
  const testScores = [
    { id_no: 'testuser1', score: '10', time: '5, July 2017 13:12:00' },
    { id_no: 'testuser2', score: '9', time: '5, July 2017 13:05:00' },
  ];

  const fakeServer = nock(`https://${host}:${port}`)
    .get('/scoreboard/Lab1');

  const httpOK = 200;

  fakeServer.reply(httpOK, testScores);

  showModel.show({
    name: 'score',
    details: {
      lab: 'Lab1',
    },
  }, callbackSpy);

  setTimeout(() => {
    callbackSpy.should.have.been.calledWithExactly({
      name: 'score',
      details: {
        scores: [['testuser1', '10', '5, July 2017 13:12:00'],
          ['testuser2', '9', '5, July 2017 13:05:00']],
      },
    });
    mocklogger.verify();
    done();
  }, testTimeout);
}

// function testInvalidLab(done) {
//   const mocklogger = sandbox.mock(logger).expects('log').atLeast(1);
//   const callbackSpy = sandbox.spy();
//   const testTimeout = 20;

//   const fakeServer = nock(`https://${host}:${port}`)
//     .get('/scoreboard/lab2');

//   const httpOK = 200;

//   fakeServer.reply(httpOK, false);

//   showModel.show({
//     name: 'score',
//     details: {
//       lab: 'lab2',
//     },
//   }, callbackSpy);

//   setTimeout(() => {
//     callbackSpy.should.have.been.calledWithExactly({ name: 'invalid_lab' });
//     mocklogger.verify();
//     done();
//   }, testTimeout);
// }

// eslint-disable-next-line max-lines-per-function
function testShowScoreStudent(done) {
  const mocklogger = sandbox.mock(logger).expects('log').atLeast(1);
  const callbackSpy = sandbox.spy();
  const testTimeout = 20;
  const testScores = [
    { id_no: 'testuser1', score: '10', time: '5, July 2017 13:12:00' },
    { id_no: 'testuser2', score: '9', time: '5, July 2017 13:05:00' },
  ];

  const fakeServer = nock(`https://${host}:${port}`)
    .get('/scoreboard/Lab1');

  const httpOK = 200;

  fakeServer.reply(httpOK, testScores);

  showModel.show({
    name: 'score',
    details: {
      lab: 'Lab1',
      id: 'testuser2',
    },
  }, callbackSpy);

  setTimeout(() => {
    callbackSpy.should.have.been.calledWithExactly({
      name: 'score',
      details: {
        scores: [['testuser2', '9', '5, July 2017 13:05:00']],
      },
    });
    mocklogger.verify();
    done();
  }, testTimeout);
}

function testHttpFailure(done) {
  const mocklogger = sandbox.mock(logger).expects('log').atLeast(1);
  const callbackSpy = sandbox.spy();
  const testTimeout = 10;

  const httpError = 4;
  showModel.show({
    name: 'score',
    details: {
      lab: 'Lab1',
    },
  }, callbackSpy);

  setTimeout(() => {
    callbackSpy.should.have.been.calledWithExactly({
      name: 'httpFailure',
      details: {
        code: httpError,
      },
    });
    mocklogger.verify();
    done();
  }, testTimeout);
}

function testDefaultEvent(done) {
  const callbackSpy = sandbox.spy();

  showModel.show({ name: 'invalid_event' }, callbackSpy);
  callbackSpy.should.have.been.calledWithExactly({ name: 'invalid_event' });
  done();
}

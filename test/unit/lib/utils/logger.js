const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const winston = require('winston');

const { logger } = require('../../../../lib/utils/logger');

chai.use(sinonChai);
chai.should();

const sandbox = sinon.createSandbox();

describe('for logger', function () {
  it('should be an instance of winston', testWinstonInstance);

  describe('moduleLog', function () {
    afterEach(function () {
      sandbox.restore();
    });

    it('should call log with correct arguments; string', testCorrectCallString);
    it('should call log with correct arguments; object no filter', testCorrectCallNoFilter);
    it('should call log with correct arguments; object filter password', testCorrectCallFilterPassword);
    it('should call log with correct arguments; array no filter', testCorrectCallArrayNoFilter);
    it('should call log as MAIN', testMAINLog);
  });
});

function testWinstonInstance(done) {
  logger.should.be.an.instanceOf(winston.constructor);
  logger.should.have.a.property('moduleLog');
  done();
}

function testCorrectCallString(done) {
  const mocklog = sandbox.mock(logger);
  mocklog.expects('log').withExactArgs({
    level: 'warn',
    module: 'test1',
    message: 'Test Message',
  });
  logger.moduleLog('warn', 'test1', 'Test Message');
  mocklog.verify();
  done();
}

function testCorrectCallNoFilter(done) {
  const mocklog = sandbox.mock(logger);
  const testObject = {
    username: 'Mike',
    id: '890',
  };

  mocklog.expects('log').withExactArgs({
    level: 'info',
    module: 'test2',
    message: JSON.stringify(testObject),
  });
  logger.moduleLog('info', 'test2', testObject);
  done();
}

function testCorrectCallFilterPassword(done) {
  const mocklog = sandbox.mock(logger);
  const testObject = {
    username: 'Bob',
    password: 'TryMe@12',
  };
  const expectObject = {
    username: 'Bob',
    password: '<removed>',
  };

  mocklog.expects('log').withExactArgs({
    level: 'error',
    module: 'test3',
    message: JSON.stringify(expectObject),
  });
  logger.moduleLog('error', 'test3', testObject);
  mocklog.verify();
  done();
}

function testCorrectCallArrayNoFilter(done) {
  const mocklog = sandbox.mock(logger);
  const testObject = ['stud_det', {
    username: 'Mike',
    id: '890',
  }];

  mocklog.expects('log').withExactArgs({
    level: 'info',
    module: 'test2',
    message: `
    ${testObject[0]}
    ${JSON.stringify(testObject[1])}`,
  });
  logger.moduleLog('info', 'test2', testObject);
  mocklog.verify();
  done();
}

function testMAINLog(done) {
  const stubConsole = sandbox.stub(process.stdout, 'write');
  const testTransport = new winston.transports.Console();
  logger.add(testTransport);

  logger.moduleLog('error', undefined, 'Main module warning');
  stubConsole.should.have.been.calledWithMatch('[error] MAIN: Main module warning');

  logger.remove(testTransport);

  done();
}

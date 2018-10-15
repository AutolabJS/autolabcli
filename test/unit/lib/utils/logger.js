const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const winston = require('winston');

const { logger } = require('../../../../lib/utils/logger');

chai.use(sinonChai);
chai.should();

describe('for logger', () => {
  it('should be an instance of winston', (done) => {
    logger.should.be.an.instanceOf(winston.constructor);
    logger.should.have.a.property('moduleLog');
    done();
  });

  describe('moduleLog', () => {
    const sandbox = sinon.createSandbox();

    afterEach(() => {
      sandbox.restore();
    });

    it('should call log with correct arguments; string', (done) => {
      const mocklog = sandbox.stub(logger, 'log');
      logger.moduleLog('warn', 'test1', 'Test Message');
      mocklog.should.be.calledWith({
        level: 'warn',
        module: 'test1',
        message: 'Test Message',
      });
      done();
    });

    it('should call log with correct arguments; no filter', (done) => {
      const mocklog = sandbox.stub(logger, 'log');
      const testObject = {
        username: 'Mike',
        id: '890',
      };

      logger.moduleLog('info', 'test2', testObject);

      mocklog.should.be.calledWith({
        level: 'info',
        module: 'test2',
        message: JSON.stringify(testObject),
      });
      done();
    });

    it('should call log with correct arguments; filter password', (done) => {
      const mocklog = sandbox.stub(logger, 'log');
      const testObject = {
        username: 'Bob',
        password: 'TryMe@12',
      };
      const expectObject = {
        username: 'Bob',
        password: '<removed>',
      };

      logger.moduleLog('error', 'test3', testObject);

      mocklog.should.be.calledWith({
        level: 'error',
        module: 'test3',
        message: JSON.stringify(expectObject),
      });
      done();
    });

    it('should call log as MAIN', (done) => {
      const stubConsole = sandbox.stub(process.stdout, 'write');
      const testTransport = new winston.transports.Console();
      logger.add(testTransport);

      logger.moduleLog('error', undefined, 'Main module warning');
      stubConsole.should.have.been.calledWithMatch('[error] MAIN: Main module warning');

      logger.remove(testTransport);

      done();
    });
  });
});

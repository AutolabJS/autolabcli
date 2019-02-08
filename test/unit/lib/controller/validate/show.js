const chai = require('chai');
const sinonChai = require('sinon-chai');

const showValidator = require('../../../../../lib/controller/validate/show');

chai.use(sinonChai);
chai.should();

describe('for eval validate', function () {
  it('should return right event on valid lab', testValidLab);
  it('should return right event on invalid options for score', testInvalidOptions);
  it('should return right event on status', testShowStatus);
});

function testValidLab(done) {
  const testOptions = {
    name: 'score',
    details: {
      lab: 'test',
    },
  };
  const ret = showValidator.validate(testOptions);
  ret.should.be.deep.equal(testOptions);
  done();
}

function testInvalidOptions(done) {
  const testOptions = {
    name: 'score',
    details: { },
  };
  const ret = showValidator.validate(testOptions);
  ret.should.be.deep.equal({ name: 'invalid_options' });
  done();
}

function testShowStatus(done) {
  const ret = showValidator.validate({ name: 'status' });
  ret.should.be.deep.equal({ name: 'status' });
  done();
}

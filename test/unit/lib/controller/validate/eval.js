const sinonChai = require('sinon-chai');
const chai = require('chai');
const path = require('path');
const fs = require('fs');

const evalValidator = require('../../../../../lib/controller/validate/eval');

const defaultPrefPath = path.join(__dirname, '../../../../../default-prefs.json');
const defaultPrefs = JSON.parse(fs.readFileSync(defaultPrefPath, 'utf8'));

const { supportedLanguages } = defaultPrefs;

chai.use(sinonChai);
chai.should();


describe('for eval validate', function () {
  it('should return right event on valid language', testValidLang);
  it('should return right event on invalid language', testInvalidLang);
  it('should return right event on root user', testRootUser);
});

function testValidLang(done) {
  const ret = evalValidator.validate({
    name: 'evaluate',
    details: {
      lab: 'test3',
      lang: 'java',
      idNo: 'testuser',
      commitHash: '',
    },
  });
  ret.should.deep.equal({
    name: 'evaluate',
    details: {
      lab: 'test3',
      lang: 'java',
      idNo: 'testuser',
      commitHash: '',
    },
  });
  done();
}

function testInvalidLang(done) {
  const ret = evalValidator.validate({
    name: 'evaluate',
    details: {
      lab: 'test3',
      lang: 'exilr',
      idNo: 'testuser',
      commitHash: '',
    },
  });
  ret.should.deep.equal({
    name: 'invalid_lang',
    details: {
      supportedLanguages,
    },
  });
  done();
}

function testRootUser(done) {
  const ret = evalValidator.validate({
    name: 'evaluate',
    details: {
      lab: 'test3',
      lang: 'java',
      idNo: 'root',
      i: 'testuser2',
      commitHash: '',
    },
  });
  ret.should.deep.equal({
    name: 'evaluate',
    details: {
      lab: 'test3',
      lang: 'java',
      idNo: 'testuser2',
      commitHash: '',
    },
  });
  done();
}

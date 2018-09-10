const chai = require('chai');
const envCheck = require('../../../../lib/utils/environmet-check');

chai.should();
process.env.validFile = './package.json';

describe('For environment checks', () => {
  it('Checks response for null variable', () => {
    (envCheck.check.bind(envCheck, '')).should.throw(Error, 'Path to config file is not specified.');
  });

  it('Checks valid environment variable', () => {
    (envCheck.check.bind(envCheck, 'validFile')).should.not.throw(Error);
  });
});
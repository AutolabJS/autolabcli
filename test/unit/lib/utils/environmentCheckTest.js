const chai = require('chai');
const envCheck = require('../../../../lib/utils/environment-check');

chai.should();
process.env.validFile = './package.json';
process.env.invalidFile = './test/data/mock-file';

describe('For environment checks', () => {
  it('Checks response for null variable', () => {
    (envCheck.check.bind(envCheck, '')).should.throw(Error, 'Path to config file is not specified.');
  });

  it('Checks valid environment variable', () => {
    (envCheck.check.bind(envCheck, 'validFile')).should.not.throw(Error);
  });

  it('Checks invalid environment variable', () => {
    (envCheck.check.bind(envCheck, 'invalidFile')).should.throw(Error, 'Config file does not exists or has no read permissions.');
  });
});

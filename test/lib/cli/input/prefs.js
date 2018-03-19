const inquirer = require('inquirer');
const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);
chai.should();

const prefsInput = require('../../../../lib/cli/input/prefs');

chai.use(chaiAsPromised);
chai.should();


describe('for prefs input', () => {

  let sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  it('should send the right event when language is changed', async () => {
    mockInquirer = sandbox.mock(inquirer);
    mockInquirer.expects('prompt').returns(Promise.resolve({lang: 'cpp14'}));
    const ret = await prefsInput.getInput({preference: 'changelang'}, null);
    ret.should.deep.equal({
      name: 'lang_changed',
      details: {
        lang: 'cpp14'
      }
    });
  });

  it('should send the right event when server is changed', async () => {
    const ret = await prefsInput.getInput({
      preference: 'changeserver',
    }, {
      url: 'abc',
      port: '5555'
    });
    ret.should.deep.equal({
      name: 'server_changed',
      details: {
        host: 'abc',
        port: '5555'
      }
    });
  });

  it('should send the appropriate message when url is not given', async () => {
    const ret = await prefsInput.getInput({
      preference: 'changeserver',
    }, {port: '5555'});
    ret.should.deep.equal({
      name: 'no_url',
    });
  });

  it('should send the appropriate message when invalid port is given', async () => {
    const ret = await prefsInput.getInput({
      preference: 'changeserver',
    }, {
      url: 'abc',
      port: '555a'
    });
    ret.should.deep.equal({
      name: 'invalid_port',
    });
  });

  it('should send the appropriate message  for show argument', async () => {
    const ret = await prefsInput.getInput({
      preference: 'show',
    });
    ret.should.deep.equal({
      name: 'show_prefs',
    });
  });

});

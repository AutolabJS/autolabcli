const inquirer = require('inquirer');
const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const path = require('path');

chai.use(sinonChai);
chai.should();

const prefsInput = require('../../../../../lib/cli/input/prefs');
const defaultPrefPath = path.join(__dirname, '../../../../../default-prefs.json');
const defaultPrefs = JSON.parse(require('fs').readFileSync(defaultPrefPath, 'utf8'));
const {supportedLanguages} = defaultPrefs;

chai.use(chaiAsPromised);
chai.should();


describe('for prefs input', () => {

  let sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  it('should send the right event when language is changed using prompt', async () => {
    mockInquirer = sandbox.mock(inquirer);
    mockInquirer.expects('prompt').resolves({lang: 'cpp14'});
    const ret = await prefsInput.getInput({preference: 'changelang'}, {lang: null});
    ret.should.deep.equal({
      name: 'lang_changed',
      details: {
        lang: 'cpp14'
      }
    });
  });

  it('should send the right event when language is changed using lang flag', async () => {
    const ret = await prefsInput.getInput({preference: 'changelang'}, {lang: 'cpp'});
    ret.should.deep.equal({
      name: 'lang_changed',
      details: {
        lang: 'cpp'
      }
    });
  });

  it('should send the right event when invalid language is provided using lang flag', async () => {
    const ret = await prefsInput.getInput({preference: 'changelang'}, {lang: 'python4'});
    ret.should.deep.equal({
      name: 'invalid_lang',
      details: {
        supportedLanguages
      }
    });
  });

  it('should send the right event when server is changed', async () => {
    const ret = await prefsInput.getInput({
      preference: 'changeserver',
    }, {
      host: 'abc.com',
      port: '5555'
    });
    ret.should.deep.equal({
      name: 'server_changed',
      details: {
        host: 'abc.com',
        port: '5555'
      }
    });
  });

  it('should prompt when host is not given', async () => {
    mockInquirer = sandbox.mock(inquirer);
    mockInquirer.expects('prompt').resolves({host: 'abc.com', port:'5555'});
    const ret = await prefsInput.getInput({
      preference: 'changeserver',
    }, {port: '5555'});
    ret.should.deep.equal({
      name: 'server_changed',
      details: {
        host: 'abc.com',
        port: '5555'
      }
    });
  });

  it('should send the appropriate message when invalid host is given', async () => {
    const ret = await prefsInput.getInput({
      preference: 'changeserver',
    }, {
      host: 'abc',
      port: '555'
    });
    ret.should.deep.equal({
      name: 'invalid_host',
    });
  });

  it('should send the appropriate message when invalid port is given', async () => {
    const ret = await prefsInput.getInput({
      preference: 'changeserver',
    }, {
      host: 'abc.com',
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

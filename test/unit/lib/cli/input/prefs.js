const inquirer = require('inquirer');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const path = require('path');

chai.use(sinonChai);
chai.should();

const prefsInput = require('../../../../../lib/cli/input/prefs');

const defaultPrefPath = path.join(__dirname, '../../../../../default-prefs.json');
const defaultPrefs = JSON.parse(require('fs').readFileSync(defaultPrefPath, 'utf8'));

const { supportedLanguages } = defaultPrefs;

chai.use(chaiAsPromised);
chai.should();


describe('for prefs input', () => {
  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  it('should send the right event when language is changed using prompt', async () => {
    mockInquirer = sandbox.mock(inquirer);
    mockInquirer.expects('prompt').resolves({ lang: 'cpp14' });
    const ret = await prefsInput.getInput({ preference: 'changelang' }, { lang: null });
    ret.should.deep.equal({
      name: 'lang_changed',
      details: {
        lang: 'cpp14',
      },
    });
  });

  it('should send the right event when language is changed using lang flag', async () => {
    const ret = await prefsInput.getInput({ preference: 'changelang' }, { lang: 'cpp' });
    ret.should.deep.equal({
      name: 'lang_changed',
      details: {
        lang: 'cpp',
      },
    });
  });

  it('should send the right event when invalid language is provided using lang flag', async () => {
    const ret = await prefsInput.getInput({ preference: 'changelang' }, { lang: 'python4' });
    ret.should.deep.equal({
      name: 'invalid_lang',
      details: {
        supportedLanguages,
      },
    });
  });

  it('should prompt when type of the server is not provided', async () => {
    mockInquirer = sandbox.mock(inquirer);
    mockInquirer.expects('prompt').resolves({ type: 'ms' });
    const ret = await prefsInput.getInput({
      preference: 'changeserver',
    }, { host: 'abc.com', port: '5555' });
    ret.should.deep.equal({
      name: 'server_changed',
      details: {
        type: 'ms',
        host: 'abc.com',
        port: '5555',
      },
    });
  });

  it('should send the right event when main server is changed', async () => {
    const ret = await prefsInput.getInput({
      preference: 'changeserver',
    }, {
      type: 'ms',
      host: 'abc.com',
      port: '5555',
    });
    ret.should.deep.equal({
      name: 'server_changed',
      details: {
        type: 'ms',
        host: 'abc.com',
        port: '5555',
      },
    });
  });

  it('should send the right event when gitlab server is changed', async () => {
    const ret = await prefsInput.getInput({
      preference: 'changeserver',
    }, {
      type: 'gitlab',
      host: 'abc.com',
    });
    ret.should.deep.equal({
      name: 'server_changed',
      details: {
        type: 'gitlab',
        host: 'abc.com',
      },
    });
  });

  it('should prompt when host is not given for changing main server', async () => {
    mockInquirer = sandbox.mock(inquirer);
    mockInquirer.expects('prompt').resolves({ host: 'abc.com', port: '5555' });
    const ret = await prefsInput.getInput({
      preference: 'changeserver',
    }, { type: 'ms', port: '5555' });
    ret.should.deep.equal({
      name: 'server_changed',
      details: {
        type: 'ms',
        host: 'abc.com',
        port: '5555',
      },
    });
  });

  it('should prompt when host is not given for changing gitlab server', async () => {
    mockInquirer = sandbox.mock(inquirer);
    mockInquirer.expects('prompt').resolves({ host: 'abc.com' });
    const ret = await prefsInput.getInput({
      preference: 'changeserver',
    }, { type: 'gitlab' });
    ret.should.deep.equal({
      name: 'server_changed',
      details: {
        type: 'gitlab',
        host: 'abc.com',
      },
    });
  });

  it('should send the appropriate message when invalid host is given for main server', async () => {
    const ret = await prefsInput.getInput({
      preference: 'changeserver',
    }, {
      type: 'ms',
      host: 'abc',
      port: '555',
    });
    ret.should.deep.equal({
      name: 'invalid_host',
    });
  });
  it('should send the appropriate message when invalid host is given for gitlab server', async () => {
    const ret = await prefsInput.getInput({
      preference: 'changeserver',
    }, {
      type: 'gitlab',
      host: 'abc',
    });
    ret.should.deep.equal({
      name: 'invalid_host',
    });
  });

  it('should send the appropriate message when invalid port is given', async () => {
    const ret = await prefsInput.getInput({
      preference: 'changeserver',
    }, {
      type: 'ms',
      host: 'abc.com',
      port: '555a',
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

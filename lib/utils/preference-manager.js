const Preferences = require('preferences');
const _ = require('lodash');
const path = require('path');

const prefDirectory = `${require('os').homedir()}/.autolabjs`;

const defaultPrefPath = path.join(__dirname, '../../default-prefs.json');
const defaultPrefs = JSON.parse(require('fs').readFileSync(defaultPrefPath, 'utf8'));
const defaultLang = defaultPrefs.submission.language;
const defaultMainServer = defaultPrefs.main_server;
const defaultGitlab = defaultPrefs.gitlab;

const cliPrefs = new Preferences('autolabjs.cli.config', {}, {
  encrypt: false,
  file: `${prefDirectory}/cli-prefs.json`,
  format: 'json'
});

const locations = new Preferences('autolabjs.locations', {}, {
  encrypt: false,
  file: `${prefDirectory}/locations.json`,
  format: 'json'
});

const gitLabPrefs = new Preferences('autolabjs.gitlab.credentials', {}, {
  encrypt: true,
  file: `${prefDirectory}/gitlab-credentials`
});

const deleteCredentials = () => {
  gitLabPrefs.username = '';
  gitLabPrefs.password = '';
  gitLabPrefs.privateToken = '';
  gitLabPrefs.storedTime = -1;
}

const setDefaultGitlabHost = () => {
  setPreference({
    name: 'cliPrefs',
    values: {
      gitlab: {
        host: defaultGitlab.host
      }
    }
  });
}

const setDefaultLanguage = () => {
  setPreference({
    name: 'cliPrefs',
    values: {
      submission: {
        language: defaultLang
      }
    }
  });
}

const setDefaultMainServer = () => {
  setPreference({
    name: 'cliPrefs',
    values: {
      main_server: {
        host: defaultMainServer.host,
        port: defaultMainServer.port
      }
    }
  });
}

const setDefaultPreferences = () => {
  if (!cliPrefs.gitlab) {
    setDefaultGitlabHost();
  }
  if (!cliPrefs.submission) {
    setDefaultLanguage();
  }
  if (!cliPrefs.main_server) {
    setDefaultMainServer();
  }
}

const storeGitlabPrefs = (values) => {
  _.assign(gitLabPrefs, values);
  gitLabPrefs.storedTime = Date.now();
}

const getPreference = (options) => {
  switch (options.name) {
    case 'gitLabPrefs':
      return gitLabPrefs;
    case 'cliPrefs':
      return cliPrefs;
  }
}

const setPreference = (options) => {
  switch (options.name) {
    case 'gitLabPrefs':
      storeGitlabPrefs(options.values);
      return;
    case 'cliPrefs':
      _.assign(cliPrefs, options.values);
      return;
    default:
      setDefaultPreferences();
  }
}

module.exports = {
  deleteCredentials,
  getPreference,
  setPreference
}

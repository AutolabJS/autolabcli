const Preferences = require('preferences');
const prefDirectory = `${require('os').homedir()}/.autolabjs`;

const cliConfig = new Preferences('autolabjs.cli.config', {}, {
  encrypt: false,
  file: `${prefDirectory}/prefs.json`,
  format: 'json'
});

const locations = new Preferences('autolabjs.locations', {}, {
  encrypt: false,
  file: `${prefDirectory}/locations.json`,
  format: 'json'
});

const gitLabPref = new Preferences('autolabjs.gitlab.credentials', {}, {
  encrypt: true,
  file: `${prefDirectory}/gitlab-credentials`
});

const storeGitLabCredentials = (username, password, privateToken) => {
  gitLabPref.username = username;
  gitLabPref.password = password;
  gitLabPref.privateToken = privateToken;
  gitLabPref.storedTime = Date.now();
}

const getGitLabCredentials = () => {
  return gitLabPref;
}

const deleteCredentials = () => {
  gitLabPref.username = '';
  gitLabPref.password = '';
  gitLabPref.privateToken = '';
  gitLabPref.storedTime = -1;
}

const getStoredTime = () => {
  return gitLabPref.storedTime;
}

const setGitlabPref = (url) => {
  cliConfig.gitlab = {
    role: 'gitlab',
    host: url
  }
}

const setMainServerPref = (main_server) => {
  cliConfig.main_server = {
    role: 'main_server',
    host: main_server.host,
    port: main_server.port
  }
}

const setLangPref = (language) => {
    cliConfig.submission = {
      language
    }
}

const getGitlabHost = () => {
  return cliConfig.gitlab.host;
}

const getPrivateToken = () => {
  return gitLabPref.privateToken;
}

const setDefaultPreferences = () => {
  if (!cliConfig.gitlab) {
    setGitlabPref('autolab.bits-goa.ac.in');
  }
  if (!cliConfig.submission) {
    setLangPref('java');
  }
  setMainServerPref({
    host: 'autolab.bits-goa.ac.in',
    port: '9000'
  });
}

const setLocationDirectory = () => {
  locations.directory = process.cwd();
}

const getLocationDirectory = () => {
  return locations.directory;
}

const removeLocationDirectory = () => {
  locations.directory = '';
}

module.exports = {
  getGitLabCredentials,
  getGitlabHost,
  getPrivateToken,
  setLangPref,
  setDefaultPreferences,
  storeGitLabCredentials,
  setGitlabPref,
  setMainServerPref,
  getStoredTime,
  setLocationDirectory,
  getLocationDirectory,
  removeLocationDirectory,
  deleteCredentials
}

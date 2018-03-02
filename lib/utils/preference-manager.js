const Preferences = require('preferences');
const prefDirectory = `${require('os').homedir()}/.autolabjs`;

const cliConfig = new Preferences('autolabjs.cli.config', {}, {
  encrypt: false,
  file: `${prefDirectory}/cli-config.json`,
  format: 'json'
});

const storeGitLabCredentials = (username, password, privateToken) => {
  const gitLabPref = new Preferences('autolabjs.gitlab.credentials', {}, {
    encrypt: true,
    file: `${prefDirectory}/gitlab-credentials`
  });
  gitLabPref.username = username;
  gitLabPref.password = password;
  gitLabPref.privateToken = privateToken;
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
  const gitLabPref = new Preferences('autolabjs.gitlab.credentials', {}, {
    encrypt: true,
    file: `${prefDirectory}/gitlab-credentials`
  });
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

module.exports = {
  getGitlabHost,
  getPrivateToken,
  setLangPref,
  setDefaultPreferences,
  storeGitLabCredentials,
  setGitlabPref,
  setMainServerPref
}

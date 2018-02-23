const Preferences = require('preferences');

const hostPref = new Preferences('autolabjs.host');
const langPref = new Preferences('autolabjs.lang');

const storeGitLabCredentials = (username, password, privateToken) => {
  const gitLabPref = new Preferences('autolabjs.gitlab');
    gitLabPref.username = username;
    gitLabPref.password = password;
    gitLabPref.privateToken = privateToken;
}

const clearGitLabCredentials = () => {
  const gitLabPref = new Preferences('autolabjs.gitlab', {
    username: '',
    password: '',
    privateToken: ''
  });
}

const setHostPref = (url) => {
  hostPref.host = url;
}

const getHost = () => {
  return hostPref.host;
}

const setLangPref = (language) => {
    langPref.lang = language;
}

const setDefaultPreferences = () => {
  if (!hostPref.host) {
    setHostPref('https://autolab.bits-goa.ac.in');
  }
  if (!langPref.lang) {
    setLangPref('java');
  }
}

module.exports = {
  setHostPref,
  setLangPref,
  setDefaultPreferences,
  storeGitLabCredentials,
  clearGitLabCredentials,
  getHost
}

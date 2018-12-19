const validator = require('validator');
const preferenceManager = require('../utils/preference-manager');

const hostValidator = (host, flags) => {
  if (validator.isFQDN(host) || validator.isIP(host)) {
    return true;
  }
  return flags === true ? false : 'Enter a valid hostname or IP';
};

const portValidator = (port, flags) => {
  if (validator.isPort(port)) {
    return true;
  }
  return flags === true ? false : 'Enter a valid port';
};

const keywordValidator = (keyword, flags) => {
  const { blacklist } = preferenceManager.getPreference({ name: 'cliPrefs' }).logger;
  if (!blacklist.includes(keyword)) {
    return true;
  }
  return flags === true ? false : 'Keyword already exists. Enter any other keyword';
};

module.exports = {
  hostValidator,
  portValidator,
  keywordValidator,
};

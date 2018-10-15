const requestPromise = require('request-promise');
const preferenceManager = require('../utils/preference-manager');
const { logger } = require('../utils/logger');

const fetchPrivateToken = async (host, username, password) => {
  const options = {
    method: 'POST',
    uri: `https://${host}/api/v4/session?login=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
    rejectUnauthorized: false,
  };

  logger.moduleLog('debug', 'Init Model', `POST request to ${options.uri}`);

  const response = await requestPromise(options).json();
  return {
    privateToken: response.private_token,
    name: response.name,
  };
};

const updateCredentials = (credentials, privateToken) => {
  preferenceManager.setPreference({
    name: 'gitLabPrefs',
    values: {
      username: credentials.username,
      password: credentials.password,
      privateToken,
    },
  });
};

const authenticate = async (credentials) => {
  try {
    const { privateToken, name } = await fetchPrivateToken(preferenceManager.getPreference({ name: 'cliPrefs' }).gitlab.host, credentials.username, credentials.password);
    logger.moduleLog('debug', 'Init Model', `Authenticated ${name}.`);
    updateCredentials(credentials, privateToken);
    return {
      code: 200,
      name,
    };
  } catch (e) {
    logger.moduleLog('error', 'Init Model', `${e}`);
    if (!e.statusCode) {
      logger.moduleLog('error', 'Init Model', 'Error code = 4');
      return {
        code: 4,
      };
    }
    return {
      code: e.statusCode,
    };
  }
};

module.exports = {
  authenticate,
};

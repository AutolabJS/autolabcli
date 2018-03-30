const requestPromise = require('request-promise');
const preferenceManager = require('../utils/preference-manager');

const fetchPrivateToken = async (host, username, password) => {
  const options = {
    method: 'POST',
    uri: `https://${host}/api/v4/session?login=${username}&password=${password}`,
    rejectUnauthorized: false,
  };
  const response = await requestPromise(options).json();
  return {
    privateToken: response.private_token,
    name: response.name,
  };
};

const authenticate = async (credentials) => {
  try {
    const { privateToken, name } = await fetchPrivateToken(preferenceManager.getPreference({ name: 'cliPrefs' }).gitlab.host, credentials.username, credentials.password);
    preferenceManager.setPreference({
      name: 'gitLabPrefs',
      values: {
        username: credentials.username,
        password: credentials.password,
        privateToken,
      },
    });
    return {
      code: 200,
      name,
    };
  } catch (e) {
    if (!e.statusCode) {
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

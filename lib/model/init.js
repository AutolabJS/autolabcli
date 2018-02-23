const requestPromise = require('request-promise');
const preferenceManager = require('../utils/preference-manager');

const fetchPrivateToken = async (host, username, password) => {
  const options = {
    method: 'POST',
    uri: host + '/api/v3/session?login=' + username + '&password=' + password,
    rejectUnauthorized: false
  };
  const response = await requestPromise(options).json();
  return {
    privateToken: response.private_token,
    name: response.name
  };
}

const authenticate = async (answer) => {
  try {
    const {privateToken, name} = await fetchPrivateToken(preferenceManager.getHost(), answer.username, answer.password);
    preferenceManager.storeGitLabCredentials(answer.username, answer.password, privateToken);
    return {
      code: 200,
      name: name
    };
  } catch (e) {
    if (!e.statusCode)
      return {
        code: 4,
      };
    return {
      code: e.statusCode
    };
  }

}

module.exports = {
  authenticate
};

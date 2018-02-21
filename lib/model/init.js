const requestPromise = require('request-promise');

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

module.exports = {
  fetchPrivateToken
};

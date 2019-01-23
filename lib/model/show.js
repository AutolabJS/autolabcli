const requestPromise = require('request-promise');
const preferenceManager = require('../utils/preference-manager');
const { logger } = require('../utils/logger');

const fetchStatus = async (host, port) => {
  const options = {
    method: 'GET',
    uri: `https://${host}:${port}/status`,
    rejectUnauthorized: false,
  };

  logger.moduleLog('debug', 'Show Model', `GET request to ${options.uri}`);

  const response = await requestPromise(options).json();
  return {
    name: 'status',
    details: {
      status: response,
    },
  };
};

const getStatus = async (callback) => {
  let response;
  const { host, port } = preferenceManager.getPreference({ name: 'cliPrefs' }).main_server;
  try {
    response = await fetchStatus(host, port);
  } catch (e) {
    response = {
      name: 'httpFailure',
      deatils: {
        code: e.getStatus || 4,
      },
    };
  }

  callback(response);
};

const show = (options, callback) => {
  switch (options.name) {
    case 'status':
      getStatus(callback);
      break;
    default:
      break;
  }
};

module.exports = {
  show,
};

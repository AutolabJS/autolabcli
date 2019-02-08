const requestPromise = require('request-promise');
const _ = require('lodash');
const preferenceManager = require('../utils/preference-manager');
const { logger } = require('../utils/logger');

const fetchQuery = async (host, port, query) => {
  const options = {
    method: 'GET',
    uri: `https://${host}:${port}${query}`,
    rejectUnauthorized: false,
  };

  logger.moduleLog('debug', 'Show Model', `GET request to ${options.uri}`);

  return requestPromise(options).json();
};

const getErrorMessage = (e) => {
  const httpError = 4;
  logger.moduleLog('error', 'Init Model', `Error ; ${e || httpError}`);
  return {
    name: 'httpFailure',
    details: {
      code: e.statusCode || httpError,
    },
  };
};

const getStatus = async (callback) => {
  let response;
  const { host, port } = preferenceManager.getPreference({ name: 'cliPrefs' }).main_server;
  try {
    const status = await fetchQuery(host, port, '/status');
    logger.moduleLog('debug', 'Show Model', 'Fetched status..');
    logger.moduleLog('debug', 'Show Model', status);
    response = {
      name: 'status',
      details: {
        status,
      },
    };
  } catch (e) {
    response = getErrorMessage(e);
  }

  callback(response);
};

const getFormattedScores = (scores, id) => {
  if (scores === false) {
    return {
      name: 'invalid_lab',
    };
  }
  let filteredScores = scores;
  if (id) {
    filteredScores = _.find(scores, ['id_no', id]);
    return {
      name: 'score',
      details: {
        scores: [_.values(filteredScores)],
      },
    };
  }
  return {
    name: 'score',
    details: {
      scores: _.map(filteredScores, _.values),
    },
  };
};

const getScore = async (options, callback) => {
  const { lab, id } = options;

  let response;
  const { host, port } = preferenceManager.getPreference({ name: 'cliPrefs' }).main_server;
  try {
    const scores = await fetchQuery(host, port, `/scoreboard/${lab}`);
    logger.moduleLog('debug', 'Show Model', `Fetched scores for ${lab}`);
    response = getFormattedScores(scores, id);
  } catch (e) {
    response = getErrorMessage(e);
  }

  callback(response);
};

const show = (options, callback) => {
  switch (options.name) {
    case 'status':
      getStatus(callback);
      break;
    case 'score':
      getScore(options.details, callback);
      break;
    default:
      callback(options);
      break;
  }
};

module.exports = {
  show,
};

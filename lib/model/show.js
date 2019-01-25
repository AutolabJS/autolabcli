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

const getStatus = async (callback) => {
  const httpError = 4;
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
    logger.moduleLog('error', 'Init Model', `Error ; ${e || httpError}`);
    response = {
      name: 'httpFailure',
      deatils: {
        code: e.getStatus || httpError,
      },
    };
  }

  callback(response);
};

const getFormattedScores = (scores, id) => {
  let filteredScores = scores;
  if (id) {
    filteredScores = _.find(scores, ['id_no', id]);
    return [_.values(filteredScores)];
  }
  return _.map(filteredScores, _.values);
};

const getScore = async (options, callback) => {
  const { lab, id } = options;

  const httpError = 4;
  let response;
  const { host, port } = preferenceManager.getPreference({ name: 'cliPrefs' }).main_server;
  try {
    const scores = await fetchQuery(host, port, `/scoreboard/${lab}`);
    logger.moduleLog('debug', 'Show Model', `Fetched scores for ${lab}`);
    response = {
      name: 'score',
      details: {
        scores: getFormattedScores(scores, id),
      },
    };
  } catch (e) {
    logger.moduleLog('error', 'Init Model', `Error ; ${e || httpError}`);
    response = {
      name: 'httpFailure',
      deatils: {
        code: e.getStatus || httpError,
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

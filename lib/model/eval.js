const io = require('socket.io-client');
const preferenceManager = require('../utils/preference-manager');

const { logger } = require('../utils/logger');

const connectToSocket = () => {
  const cliPrefs = preferenceManager.getPreference({ name: 'cliPrefs' });
  const { host } = cliPrefs.main_server;
  const { port } = cliPrefs.main_server;

  logger.moduleLog('debug', 'Eval Model', `Opening a socket connection to http://${host}:${port}`);

  const socket = io.connect(`http://${host}:${port}`);
  return socket;
};

const getRequestArray = (evalOptions) => {
  const {
    lab, idNo, commitHash, lang,
  } = evalOptions;
  return [idNo, lab, commitHash, lang];
};

const socketEventHandler = (event, socket, data, callback) => { 
  let response;
  switch (event) {
    case 'invalid':
      logger.moduleLog('error', 'Eval Model', 'Invalid options provided.');
      response = {
        name: 'invalid',
      };
      break;
    case 'submission_pending':
      logger.moduleLog('debug', 'Eval Model', 'Submission Pending...');
      response = {
        name: 'submission_pending',
      };
      break;
    case 'scores':
      logger.moduleLog('debug', 'Eval Model', 'Sucessfully Sumbitted. Evaluated results');
      response = {
        name: 'scores',
        details: {
          ...data,
        },
      };
      break;
    default:
      response = {
        name: event,
        details: {
          ...data,
        },
      };
  }

  logger.moduleLog('error', 'Eval Model', data);
  socket.close();
  callback(response);
};

const getResponse = (socket, callback) => {
  socket.on('invalid', (data) => {
    socketEventHandler('invalid', socket, data, callback);
  });
  socket.on('submission_pending', (data) => {
    socketEventHandler('submission_pending', socket, data, callback);
  });
  socket.on('scores', (data) => {
    socketEventHandler('scores', socket, data, callback);
  });
};

const evaluate = (evalOptions, callback) => {
  const socket = connectToSocket();
  const req = getRequestArray(evalOptions);
  socket.emit('submission', req);
  getResponse(socket, callback);
};

module.exports = {
  evaluate,
};

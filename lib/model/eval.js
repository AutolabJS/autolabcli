const io = require('socket.io-client');
const preferenceManager = require('../utils/preference-manager');

const { logger } = require('../utils/logger');

const handlerMiddleware = (socket) => {
  const { onevent } = socket;
  /* eslint-disable-next-line no-param-reassign */
  socket.onevent = function newOnevent(packet) {
    const args = packet.data || [];
    if (!onevent.call(this, packet)) {
      /* eslint-disable-next-line no-param-reassign */
      packet.data = ['default'].concat([args]);
      onevent.call(this, packet);
    }
  };
};

const connectToSocket = () => {
  const cliPrefs = preferenceManager.getPreference({ name: 'cliPrefs' });
  const { host } = cliPrefs.main_server;
  const { port } = cliPrefs.main_server;

  logger.moduleLog('debug', 'Eval Model', `Opening a socket connection to http://${host}:${port}`);

  const socket = io.connect(`http://${host}:${port}`);
  handlerMiddleware(socket);
  return socket;
};

const getRequestArray = (evalOptions) => {
  const {
    lab, idNo, commitHash, lang,
  } = evalOptions;
  return [idNo, lab, commitHash, lang];
};

/* eslint-disable max-lines-per-function */
const socketEventHandler = (event, socket, data, callback) => {
  let response;
  switch (event) {
    case 'invalid':
      logger.moduleLog('error', 'Eval Model', 'Invalid options provided.');
      response = {
        name: 'invalid',
      };
      logger.moduleLog('debug', 'Eval Model', data);
      callback(response);
      socket.close();
      break;
    case 'submission_pending':
      logger.moduleLog('debug', 'Eval Model', 'Submission Pending...');
      response = {
        name: 'submission_pending',
      };
      logger.moduleLog('debug', 'Eval Model', data);
      callback(response);
      break;
    case 'scores':
      logger.moduleLog('debug', 'Eval Model', 'Sucessfully Sumbitted. Evaluated results');
      response = {
        name: 'scores',
        details: {
          ...data,
        },
      };
      logger.moduleLog('debug', 'Eval Model', data);
      callback(response);
      socket.close();
      break;
    default:
      logger.moduleLog('debug', 'Eval Model', data);
  }
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
  socket.on('default', (data) => {
    socketEventHandler('default', socket, data, callback);
  });
};

const evaluate = (evalOptions, callback) => {
  const socket = connectToSocket();
  const req = getRequestArray(evalOptions);
  getResponse(socket, callback);
  socket.emit('submission', req);
};

module.exports = {
  evaluate,
};

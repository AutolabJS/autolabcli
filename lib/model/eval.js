const io = require('socket.io-client');
const preferenceManager = require('../utils/preference-manager');

const { logger } = require('../utils/logger');

const connectToSocket = () => {
  const cliPrefs = preferenceManager.getPreference({ name: 'cliPrefs' });
  const host = cliPrefs.main_server.host;
  const port = cliPrefs.main_server.port;

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

const getResponse = (socket, callback) => {
  socket.on('invalid', (data) => {
    logger.moduleLog('error', 'Eval Model', 'Invalid options provided.');
    logger.moduleLog('error', 'Eval Model', data);
    socket.close();
    callback({
      name: 'invalid',
    });
  });

  socket.on('submission_pending', (data) => {
    logger.moduleLog('debug', 'Eval Model', 'Submission Pending...');
    logger.moduleLog('debug', 'Eval Model', data);
    socket.close();
    callback({
      name: 'submission_pending',
    });
  });

  socket.on('scores', (data) => {
    logger.moduleLog('debug', 'Eval Model', 'Sucessfully Sumbitted.');
    logger.moduleLog('debug', 'Eval Model', 'Evaluated results');
    logger.moduleLog('debug', 'Eval Model', data);
    socket.close();
    callback({
      name: 'scores',
      details: {
        ...data,
      },
    });
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

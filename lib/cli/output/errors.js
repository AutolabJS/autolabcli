const chalk = require('chalk');

const sendLoggerConfigError = () => {
  const errorMessage = chalk.red(
    'Path to config file is not specified.',
    'Please specify the environment varibale LOGGERCONFIG.',
  );
  console.error(errorMessage);
};

const sendOutput = (event) => {
  switch (event) {
    case 'logger_config_nf':
      sendLoggerConfigError();
      break;
    default: break;
  }
};

module.exports = {
  sendOutput,
};
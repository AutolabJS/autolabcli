const commandValidator = require('@utils/command-validator');
const exitOutput = require('@output/exit');
const exitModel = require('@model/exit');

const onExit = async (args, options, logger) => {
  const isValidSession = commandValidator.validateSession();
  if (!isValidSession) {
    return;
  }
  await exitModel.logout();
  exitOutput.sendOutput({
    name: 'logout_success',
  });
};

const addTo = (program) => {
  program
    .command('exit', 'Logout of AutolabJS. Clears your stored clredentials.')
    .action(onExit);
};

module.exports = {
  addTo,
};

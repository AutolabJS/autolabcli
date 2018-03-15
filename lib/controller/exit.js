const commandValidator = require('../utils/command-validator');
const exitOutput = require('../cli/output/exit');
const exitModel = require('../model/exit');

const onExit = async (args, options, logger) => {
  const isValid = commandValidator.validateSession();
  if (!isValid) {
    return;
  }
  await exitModel.logout();
  exitOutput.sendOutput({
    name: 'logout_success'
  });
}

const addTo = (program) => {
  program
   .command('exit', 'Logout of AutolabJS. Clears your stored clredentials.')
   .action(onExit);
}

module.exports = {
  addTo
}

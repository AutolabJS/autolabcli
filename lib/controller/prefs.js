const prefsInput = require('../cli/input/prefs');
const prefsOutput = require('../cli/output/prefs');
const prefsModel = require('../model/prefs');
const commandValidator = require('../utils/command-validator');

const onPrefs = async (args, options, logger) => {
  const isValidSession = commandValidator.validateSession();
  if (!isValidSession) {
    return;
  }
  let changePrefEvent = await prefsInput.getInput(args, options);
  changePrefEvent = await prefsModel.storePrefs(changePrefEvent);
  prefsOutput.sendOutput(changePrefEvent);
}

const addTo = (program) => {
  program
   .command('prefs', 'Show and change language and server preferences')
   .argument('<preference>', 'Argument for prefs command', /^show|changelang|changeserver$/)
   .option('--url <server_url>', 'New url for server')
   .option('--port <server_port>', 'Port for the server')
   .action(onPrefs);
}

module.exports = {
  addTo
}

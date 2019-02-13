const prefsInput = require('../cli/input/prefs');
const prefsOutput = require('../cli/output/prefs');
const prefsModel = require('../model/prefs');

const prefsValidate = require('./validate/prefs');

const onPrefs = async (args, options, logger) => {
  logger.moduleLog('info', 'Prefs', 'Prefs command invoked for');
  logger.moduleLog('info', 'Prefs', args.preference);
  let changePrefEvent = await prefsInput.getInput(args, options);

  changePrefEvent = prefsValidate.validate(changePrefEvent);

  logger.moduleLog('debug', 'Prefs', 'Event for the prefs command called');
  logger.moduleLog('debug', 'Prefs', changePrefEvent);
  changePrefEvent = await prefsModel.storePrefs(changePrefEvent);
  prefsOutput.sendOutput(changePrefEvent);
};

const addTo = (program) => {
  program
    .command('prefs', 'Show and change language and server preferences')
    .argument('<preference>', 'Argument for prefs command')
    .option('--type <type>', 'Server type ( gitlab or main_server)')
    .option('--host <server_host>', 'Host name / IP address for server ')
    .option('--port <server_port>', 'Port for the server')
    .option('--lang <lang>', 'Change language')
    .option('--maxsize <size>', 'Change logger file maxsize')
    .option('--blacklist <keyword>', 'Add keyword to logger blacklist')
    .option('--timeouttype <type>', 'Timeout type ( session ) ')
    .option('--time <duration>', 'Timeout duration')
    .action(onPrefs);
};

module.exports = {
  addTo,
};

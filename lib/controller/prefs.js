const prefsInput = require('../cli/input/prefs');
const prefsOutput = require('../cli/output/prefs');
const prefsModel = require('../model/prefs');

const onPrefs = async (args, options, logger) => {
  let changePrefEvent = await prefsInput.getInput(args, options);
  changePrefEvent = await prefsModel.storePrefs(changePrefEvent);
  prefsOutput.sendOutput(changePrefEvent);
};

const addTo = (program) => {
  program
    .command('prefs', 'Show and change language and server preferences')
    .argument('<preference>', 'Argument for prefs command', /^show|changelang|changeserver$/)
    .option('--type', 'Server type ( gitlab or main_server)', /^ms|gitlab$/)
    .option('--host <server_host>', 'Host name / IP address for server ')
    .option('--port <server_port>', 'Port for the server')
    .option('--lang <lang>', 'Change language')
    .action(onPrefs);
};

module.exports = {
  addTo,
};

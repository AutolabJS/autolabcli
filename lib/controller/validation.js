const prefsOutput = require('../cli/output/prefs');

const supportedServers = ['ms', 'gitlab'];
const supportedCommand = ['show', 'changelang', 'changeserver', 'logger'];

const prefs = (args, options) => {
  if (supportedCommand.indexOf(args.preference) === -1) {
    prefsOutput.sendOutput({ name: 'invalid_command' });
    return false;
  }
  if (args.preference === 'changeserver') {
    if (options.type && supportedServers.indexOf(options.type) === -1) {
      prefsOutput.sendOutput({
        name: 'invalid_server',
        details: {
          supportedServers,
        },
      });
      return false;
    }
  }
  return true;
};

module.exports = {
  prefs,
};

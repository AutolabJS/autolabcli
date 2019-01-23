const showInput = require('../cli/input/show');
const showOutput = require('../cli/output/show');
const showModel = require('../model/show');

const showValidate = require('./validate/show');

const onShowResults = (showResult) => {
  showOutput.sendOutput(showResult);
};

const onShow = async (args, options, logger) => {
  logger.moduleLog('info', 'Exit', 'Show command invoked.');

  const showOptions = await showInput.getInput(args, options);
  const validatedOptions = showValidate.validate(showOptions);

  logger.moduleLog('debug', 'Eval', 'Show request for');
  logger.moduleLog('debug', 'Eval', validatedOptions);

  showOutput.sendOutput({ name: 'fetching_results' });

  showModel.show(validatedOptions, onShowResults);
};

const addTo = (program) => {
  program
    .command('show', 'Shows server status and lab scores')
    .argument('<stat>', 'Argument for show command')
    .action(onShow);
};

module.exports = {
  addTo,
};

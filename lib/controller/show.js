const showInput = require('../cli/input/show');
const showOutput = require('../cli/output/show');
const showModel = require('../model/show');

const showValidate = require('./validate/show');

const onShowResults = (showResult) => {
  showOutput.sendOutput(showResult);
};

const onShow = async (args, options, logger) => {
  logger.moduleLog('info', 'Show', 'Show command invoked.');

  const showOptions = await showInput.getInput(args, options);
  const validatedOptions = showValidate.validate(showOptions);

  logger.moduleLog('debug', 'Show', 'Show request for');
  logger.moduleLog('debug', 'Show', validatedOptions);

  showOutput.sendOutput({ name: 'fetching_results' });

  showModel.show(validatedOptions, onShowResults);
};

const addTo = (program) => {
  program
    .command('show', 'Shows server status and lab scores')
    .argument('<statistic>', 'Argument for show command')
    .option('-l <lab>', 'Lab to show score')
    .option('-i <id>', 'Student ID to show the score')
    .action(onShow);
};

module.exports = {
  addTo,
};

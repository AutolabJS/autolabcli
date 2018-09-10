const evalInput = require('../cli/input/eval');
const evalOutput = require('../cli/output/eval');
const evalModel = require('../model/eval');
const commandValidator = require('../utils/command-validator');


const onEvalResult = (evalResult) => {
  evalOutput.sendOutput(evalResult);
};

const onEval = async (args, options, logger) => {
  logger.moduleLog('info', 'Eval', 'Eval command invoked.');
  if (!commandValidator.validateSession()) {
    return;
  }
  const evalOptions = await evalInput.getInput(args, options);

  logger.moduleLog('debug', 'Eval', 'Evaluate request for');
  logger.moduleLog('debug', 'Eval', evalOptions);
  evalOutput.sendOutput({
    name: 'eval_started',
  });
  evalModel.evaluate(evalOptions, onEvalResult);
};

const addTo = (program) => {
  program
    .command('eval', 'Submit to AutolabJS for evaluation')
    .option('-l <lab>', 'Lab of submission')
    .option('-i <id>', 'Student ID')
    .option('--lang <lang>', 'Language of submission')
    .option('--hash <commit_hash>', 'Commit hash of submission')
    .action(onEval);
};

module.exports = {
  addTo,
};

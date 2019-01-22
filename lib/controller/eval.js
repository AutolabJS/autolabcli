const evalInput = require('@input/eval');
const evalOutput = require('@output/eval');
const evalModel = require('@model/eval');
const commandValidator = require('@utils/command-validator');

const onEvalResult = (evalResult) => {
  evalOutput.sendOutput(evalResult);
};

const onEval = async (args, options, logger) => {
  if (!commandValidator.validateSession()) {
    return;
  }
  const evalOptions = await evalInput.getInput(args, options);
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
    .option('-h <commit_hash>', 'Commit hash of submission')
    .action(onEval);
};

module.exports = {
  addTo,
};

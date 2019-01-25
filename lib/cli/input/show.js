const inquirer = require('inquirer');
const PromptGenerator = require('../../utils/PromptGenerator');

const getPromptGenerator = (name, type, message) => {
  const promptGenerator = new PromptGenerator();
  promptGenerator.addProperty('name', name);
  promptGenerator.addProperty('type', type);
  promptGenerator.addProperty('message', message);
  return promptGenerator;
};

const getScorePrompt = async () => {
  const prompts = [
    getPromptGenerator('lab', 'input', 'Enter the lab whose score has to be shown:').getPrompt(),
    getPromptGenerator('id', 'input', 'Enter the student id: (optional)').getPrompt(),
  ];
  const scoreOptions = await inquirer.prompt(prompts);
  return {
    name: 'score',
    details: {
      lab: scoreOptions.lab,
      id: scoreOptions.id,
    },
  };
};

const getScoreOptions = (options) => {
  const lab = options.l;
  const id = options.i;
  if (!lab) {
    return getScorePrompt();
  }
  return {
    name: 'score',
    details: {
      lab, id,
    },
  };
};

const getInput = async (args, options) => {
  switch (args.statistic) {
    case 'status':
      return {
        name: 'status',
      };
    case 'score':
      return getScoreOptions(options);
    default:
      return {
        name: 'invalid_command',
      };
  }
};

module.exports = {
  getInput,
};

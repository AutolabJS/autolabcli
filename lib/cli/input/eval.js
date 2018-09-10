const inquirer = require('inquirer');
const PromptGenerator = require('../../utils/PromptGenerator');
const preferenceManager = require('../../utils/preference-manager');
const path = require('path');

const defaultPrefPath = path.join(__dirname, '../../../default-prefs.json');
const defaultPrefs = JSON.parse(require('fs').readFileSync(defaultPrefPath, 'utf8'));

const { supportedLanguages } = defaultPrefs;
const { logger } = require('../../utils/logger');

const getLengthValidator = invalidMessage => (value) => {
  if (value.length) {
    return true;
  }

  return invalidMessage;
};

const getLabPrompt = () => {
  const labPromptGenerator = new PromptGenerator();
  labPromptGenerator.addProperty('name', 'lab');
  labPromptGenerator.addProperty('type', 'input');
  labPromptGenerator.addProperty('message', 'Enter the lab name:');
  labPromptGenerator.addProperty('validate', getLengthValidator('Please enter the lab name'));
  return labPromptGenerator.getPrompt();
};

const getLangPrompt = () => {
  const langPromptGenerator = new PromptGenerator();
  langPromptGenerator.addProperty('name', 'lang');
  langPromptGenerator.addProperty('type', 'list');
  langPromptGenerator.addProperty('message', 'Choose the submission language:');
  langPromptGenerator.addProperty('choices', supportedLanguages);
  return langPromptGenerator.getPrompt();
};

const getHashPrompt = () => {
  const hashPromptGenerator = new PromptGenerator();
  hashPromptGenerator.addProperty('name', 'commitHash');
  hashPromptGenerator.addProperty('type', 'input');
  hashPromptGenerator.addProperty('message', 'Enter the commit hash [Leave blank for latest commit in master]:');
  return hashPromptGenerator.getPrompt();
};

const getSubmitInfo = () => {
  const submitInfo = [getLabPrompt(), getLangPrompt(), getHashPrompt()];
  return inquirer.prompt(submitInfo);
};

const getIdNo = (options) => {
  
  logger.moduleLog('debug', 'Eval Input', 'Fetching id to submit.');
  const username = preferenceManager.getPreference({ name: 'gitLabPrefs' }).username;
  if (username === 'root') {
    logger.moduleLog('debug', 'Eval Input', `Root user detected, passing up the ID provided : ${options.i}.`);
    return options.i || '';
  }
  return username;
};

const isValidOptions = options => options.l && options.lang && supportedLanguages.indexOf(options.lang) !== -1;

const getInput = async (args, options) => {
  let evalOptions = {};
  if (!isValidOptions(options)) {
    evalOptions = await getSubmitInfo();
  } else {
    evalOptions.lab = options.l;
    evalOptions.lang = options.lang;
    evalOptions.commitHash = options.hash || '';
  }
  evalOptions.idNo = getIdNo(options);
  return evalOptions;
};

module.exports = {
  getInput,
};

const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');
const PromptGenerator = require('../../utils/PromptGenerator');
const preferenceManager = require('../../utils/preference-manager');

const defaultPrefPath = path.join(__dirname, '../../../default-prefs.json');
const defaultPrefs = JSON.parse(fs.readFileSync(defaultPrefPath, 'utf8'));

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

const getIdNo = () => {
  logger.moduleLog('debug', 'Eval Input', 'Fetching id to submit.');
  const { username } = preferenceManager.getPreference({ name: 'gitLabPrefs' });
  return username;
};

const getInput = async (args, options) => {
  let evalOptions = {};
  if (!options.l || !options.lang) {
    evalOptions = await getSubmitInfo();
  } else {
    evalOptions.lab = options.l;
    evalOptions.lang = options.lang;
    evalOptions.i = options.i;
    evalOptions.commitHash = options.hash || '';
  }
  evalOptions.idNo = getIdNo();
  return {
    name: 'evaluate',
    details: {
      ...evalOptions,
    },
  };
};

module.exports = {
  getInput,
};

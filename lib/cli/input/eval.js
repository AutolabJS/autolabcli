const inquirer = require('inquirer');
const PromptGenerator = require('../../utils/PromptGenerator');
const preferenceManager = require('../../utils/preference-manager');
const path = require('path');

const defaultPrefPath = path.join(__dirname, '../../../default-prefs.json');
const defaultPrefs = JSON.parse(require('fs').readFileSync(defaultPrefPath, 'utf8'));
const {supportedLanguages} = defaultPrefs;

const getLengthValidator = (invalidMessage) => {
  return (value) => {
    if (value.length) {
      return true;
    }
    else {
      return invalidMessage;
    }
  }
}

const getLabPrompt = async () => {
  const labPromptGenerator = new PromptGenerator();
  labPromptGenerator.addProperty('name', 'lab');
  labPromptGenerator.addProperty('type', 'input');
  labPromptGenerator.addProperty('message', 'Enter the lab name:');
  labPromptGenerator.addProperty('validate', getLengthValidator('Please enter the lab name'));

  const langPromptGenerator = new PromptGenerator();
  langPromptGenerator.addProperty('name', 'lang');
  langPromptGenerator.addProperty('type', 'list');
  langPromptGenerator.addProperty('message', 'Choose the submission language:');
  langPromptGenerator.addProperty('choices', supportedLanguages);

  const hashPromptGenerator = new PromptGenerator();
  hashPromptGenerator.addProperty('name', 'commitHash');
  hashPromptGenerator.addProperty('type', 'input');
  hashPromptGenerator.addProperty('message', 'Enter the commit hash [Leave blank for latest commit in master]:');

  const submitInfo = [labPromptGenerator.getPrompt(), langPromptGenerator.getPrompt(), hashPromptGenerator.getPrompt()];
  return inquirer.prompt(submitInfo);
}

const getIdNo = (options) => {
  const username = preferenceManager.getPreference({name: 'gitLabPrefs'}).username;
  if ( username === 'root') {
    return options.id;
  }
  return username;
}

const isValidOptions = (options) => {
  return options.l && options.lang && supportedLanguages.indexOf(options.lang) !== -1;
}

const getInput = async (args, options) => {
  let evalOptions = {};
  if (!isValidOptions(options)) {
    evalOptions = await getLabPrompt();
  }
  else {
    evalOptions.lab = options.l;
    evalOptions.lang = options.lang;
    evalOptions.commitHash = options.h || '';
  }
  evalOptions.idNo = getIdNo(options);
  return evalOptions;
};

module.exports = {
  getInput,
};

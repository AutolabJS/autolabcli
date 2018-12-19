const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');

const PromptGenerator = require('../../utils/PromptGenerator');
const prefsValidator = require('../../validate/prefs');

const defaultPrefPath = path.join(__dirname, '../../../default-prefs.json');
const defaultPrefs = JSON.parse(fs.readFileSync(defaultPrefPath, 'utf8'));

const { supportedLanguages } = defaultPrefs;

const changeLangPrompt = async () => {
  const langPromptGenerator = new PromptGenerator();
  langPromptGenerator.addProperty('name', 'lang');
  langPromptGenerator.addProperty('type', 'list');
  langPromptGenerator.addProperty('message', 'Choose your preferred language:');
  langPromptGenerator.addProperty('choices', supportedLanguages);

  const newLang = await inquirer.prompt(langPromptGenerator.getPrompt());
  return {
    name: 'lang_changed',
    details: {
      lang: newLang.lang,
    },
  };
};

const getPromptGenerator = (name, type, message, validate) => {
  const promptGenerator = new PromptGenerator();
  promptGenerator.addProperty('name', name);
  promptGenerator.addProperty('type', type);
  promptGenerator.addProperty('message', message);
  promptGenerator.addProperty('validate', validate);
  return promptGenerator;
};

const getTypePromptGenerator = (name, type, message, validate, choices) => {
  const promptGenerator = getPromptGenerator(name, type, message, validate);
  promptGenerator.addProperty('choices', choices);
  return promptGenerator;
};

const getHostPrompt = () => {
  const hostPromptGenerator = getPromptGenerator('host', 'input', 'Enter the host:', prefsValidator.hostValidator);
  return hostPromptGenerator.getPrompt();
};

const getPortPrompt = () => {
  const portPromptGenerator = getPromptGenerator('port', 'input', 'Enter the port:', prefsValidator.portValidator);
  return portPromptGenerator.getPrompt();
};

const getServerTypePrompt = () => {
  const typePromptGenerator = getTypePromptGenerator('type', 'list', 'Choose the server type:', undefined, ['gitlab', 'ms']);
  return typePromptGenerator.getPrompt();
};

const getLoggerPreferncePrompt = () => {
  const typePromptGenerator = getTypePromptGenerator(
    'type',
    'list',
    'Choose the logger preference to update:',
    undefined,
    ['maxsize', 'blacklist'],
  );
  return typePromptGenerator.getPrompt();
};

const changeMainServerPrompt = async () => {
  const prompts = [
    getHostPrompt(),
    getPortPrompt(),
  ];
  const serverPrefs = await inquirer.prompt(prompts);
  return {
    name: 'server_changed',
    details: {
      host: serverPrefs.host,
      port: serverPrefs.port,
      type: 'ms',
    },
  };
};

const changeGitlabPrompt = async () => {
  const prompts = [
    getHostPrompt(),
  ];
  const serverPrefs = await inquirer.prompt(prompts);
  return {
    name: 'server_changed',
    details: {
      host: serverPrefs.host,
      type: 'gitlab',
    },
  };
};

const changeMaxSize = async () => {
  const sizePromptGenrator = getPromptGenerator('maxsize', 'input', 'Enter the maximum size of the logger file:');
  const sizePrefs = await inquirer.prompt(sizePromptGenrator.getPrompt());

  return {
    name: 'logger_pref_changed',
    details: {
      maxSize: sizePrefs.maxsize,
    },
  };
};

const changeBlacklist = async () => {
  const blacklistPromptGenrator = getPromptGenerator('keyword', 'input', 'Enter the keyword to be added to logger blacklist:',
    prefsValidator.keywordValidator);
  const blacklistPrefs = await inquirer.prompt(blacklistPromptGenrator.getPrompt());

  return {
    name: 'logger_pref_changed',
    details: {
      keyword: blacklistPrefs.keyword,
    },
  };
};

const changeLoggerPrompt = async () => {
  const loggerPrompt = getLoggerPreferncePrompt();
  const { type } = (await inquirer.prompt(loggerPrompt));

  let ret;
  if (type === 'maxsize') {
    ret = changeMaxSize();
  } if (type === 'blacklist') {
    ret = changeBlacklist();
  }
  return ret;
};

module.exports = {
  changeLangPrompt,
  changeMainServerPrompt,
  changeGitlabPrompt,
  getServerTypePrompt,
  changeLoggerPrompt,
};

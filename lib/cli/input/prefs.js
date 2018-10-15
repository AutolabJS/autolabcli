const inquirer = require('inquirer');
const validator = require('validator');
const path = require('path');
const PromptGenerator = require('../../utils/PromptGenerator');
const preferenceManager = require('../../utils/preference-manager');

const defaultPrefPath = path.join(__dirname, '../../../default-prefs.json');
const defaultPrefs = JSON.parse(require('fs').readFileSync(defaultPrefPath, 'utf8'));

const { supportedLanguages } = defaultPrefs;
const { logger } = require('../../utils/logger');


const changeLangFlag = (lang) => {
  if (supportedLanguages.indexOf(lang) === -1) {
    logger.moduleLog('debug', 'Prefs Input', `Invalid language for changelang command ${lang}`);
    return {
      name: 'invalid_lang',
      details: {
        supportedLanguages,
      },
    };
  }
  return {
    name: 'lang_changed',
    details: {
      lang,
    },
  };
};

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

const changeLang = async (options) => {
  if (options.lang) {
    return changeLangFlag(options.lang);
  }
  return changeLangPrompt();
};

const hostValidator = (host, flags) => {
  if (validator.isFQDN(host) || validator.isIP(host)) {
    return true;
  }
  return flags === true ? false : 'Enter a valid hostname or IP';
};

const portValidator = (port, flags) => {
  if (validator.isPort(port)) {
    return true;
  }
  return flags === true ? false : 'Enter a valid port';
};

const keywordValidator = (keyword, flags) => {
  const { blacklist } = preferenceManager.getPreference({ name: 'cliPrefs' }).logger;
  if (!blacklist.includes(keyword)) {
    return true;
  }
  return flags === true ? false : 'Keyword already exists. Enter any other keyword';
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
  const hostPromptGenerator = getPromptGenerator('host', 'input', 'Enter the host:', hostValidator);
  return hostPromptGenerator.getPrompt();
};

const getPortPrompt = () => {
  const portPromptGenerator = getPromptGenerator('port', 'input', 'Enter the port:', portValidator);
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

const changeMainServerFlag = (host, port) => {
  if (!hostValidator(host, true)) {
    logger.moduleLog('debug', 'Prefs Input', `Invalid mainserver host ${host}`);
    return {
      name: 'invalid_host',
    };
  }
  if (!portValidator(port, true)) {
    logger.moduleLog('debug', 'Prefs Input', `Invalid mainserver port ${host}`);
    return {
      name: 'invalid_port',
    };
  }
  return {
    name: 'server_changed',
    details: {
      host,
      port,
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

const changeGitlabFlag = (host) => {
  if (!hostValidator(host, true)) {
    logger.moduleLog('debug', 'Prefs Input', `Invalid Gitlab host ${host}`);
    return {
      name: 'invalid_host',
    };
  }
  return {
    name: 'server_changed',
    details: {
      host,
      type: 'gitlab',
    },
  };
};

const changeMainServer = (host, port) => {
  if (!host || !port) {
    return changeMainServerPrompt();
  }
  return changeMainServerFlag(host, port);
};

const changeGitlab = (host) => {
  if (!host) {
    return changeGitlabPrompt();
  }
  return changeGitlabFlag(host);
};

const changeServer = async (options) => {
  let { host, port, type } = options;
  if (!type) {
    const typePrompt = getServerTypePrompt();
    type = (await inquirer.prompt(typePrompt)).type;
  }
  if (type === 'ms') {
    return changeMainServer(host, port);
  } else if (type === 'gitlab') {
    return changeGitlab(host);
  }
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
  const blacklistPromptGenrator = getPromptGenerator('keyword', 'input', 'Enter the keyword to be added to logger blacklist:', keywordValidator);
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
    const type = (await inquirer.prompt(loggerPrompt)).type;
    if (type === 'maxsize') {
      return changeMaxSize();
    } else if (type === 'blacklist') {
      return changeBlacklist();
    }
};

const changeLogger = async (options) => {
  const { blacklist, maxsize } = options;

  if (!blacklist && !maxsize) {
    return changeLoggerPrompt();
  }

  if (blacklist && !keywordValidator(blacklist, true)) {
    return {
      name: 'invalid_logger_prefs',
    };
  }

  return {
    name: 'logger_pref_changed',
    details: {
      keyword: blacklist,
      maxSize: maxsize,
    },
  };
};

const getInput = async (args, options) => {
  switch (args.preference) {
    case 'changelang':
      return await changeLang(options);
    case 'changeserver':
      return await changeServer(options);
    case 'show':
      return {
        name: 'show_prefs',
      };
    case 'logger':
      return await changeLogger(options);
  }
};

module.exports = {
  getInput,
};

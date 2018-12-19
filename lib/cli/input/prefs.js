const inquirer = require('inquirer');
const path = require('path');

const defaultPrefPath = path.join(__dirname, '../../../default-prefs.json');
const defaultPrefs = JSON.parse(require('fs').readFileSync(defaultPrefPath, 'utf8'));

const { supportedLanguages } = defaultPrefs;
const { logger } = require('../../utils/logger');
const prefPrompts = require('./prefsprompt');
const prefsValidator = require('../../validate/prefs');

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

const changeLang = async (options) => {
  if (options.lang) {
    return changeLangFlag(options.lang);
  }
  return prefPrompts.changeLangPrompt();
};

const changeMainServerFlag = (host, port) => {
  if (!prefsValidator.hostValidator(host, true)) {
    logger.moduleLog('debug', 'Prefs Input', `Invalid mainserver host ${host}`);
    return {
      name: 'invalid_host',
    };
  }
  if (!prefsValidator.portValidator(port, true)) {
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

const changeGitlabFlag = (host) => {
  if (!prefsValidator.hostValidator(host, true)) {
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
    return prefPrompts.changeMainServerPrompt();
  }
  return changeMainServerFlag(host, port);
};

const changeGitlab = (host) => {
  if (!host) {
    return prefPrompts.changeGitlabPrompt();
  }
  return changeGitlabFlag(host);
};

const changeServer = async (options) => {
  const { host, port } = options;
  let { type } = options;
  if (!type) {
    const typePrompt = prefPrompts.getServerTypePrompt();
    ({ type } = (await inquirer.prompt(typePrompt)));
  }
  if (type === 'ms') {
    return changeMainServer(host, port);
  } if (type === 'gitlab') {
    return changeGitlab(host);
  }
  return {
    name: 'invalid_server',
    details: {
      supportedServers: ['ms', 'gitlab'],
    },
  };
};

const changeLogger = async (options) => {
  const { blacklist, maxsize } = options;

  if (!blacklist && !maxsize) {
    return prefPrompts.changeLoggerPrompt();
  }

  if (blacklist && !prefsValidator.keywordValidator(blacklist, true)) {
    return {
      name: 'invalid_blacklist_keyword',
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
      return changeLang(options);
    case 'changeserver':
      return changeServer(options);
    case 'show':
      return {
        name: 'show_prefs',
      };
    case 'logger':
      return changeLogger(options);
    default:
      return {
        name: 'invalid_command',
      };
  }
};

module.exports = {
  getInput,
};

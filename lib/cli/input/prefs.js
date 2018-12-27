const inquirer = require('inquirer');
const prefPrompts = require('./prefsprompt');

const changeLang = async (options) => {
  if (!options.lang) {
    return prefPrompts.changeLangPrompt();
  }
  return {
    name: 'lang_changed',
    details: {
      lang: options.lang,
    },
  };
};

const changeMainServer = (host, port) => {
  if (!host || !port) {
    return prefPrompts.changeMainServerPrompt();
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

const changeGitlab = (host) => {
  if (!host) {
    return prefPrompts.changeGitlabPrompt();
  }
  return {
    name: 'server_changed',
    details: {
      host,
      type: 'gitlab',
    },
  };
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
    name: 'server_changed',
    details: {
      type, host, port,
    },
  };
};

const changeLogger = async (options) => {
  const { blacklist, maxsize } = options;

  if (!blacklist && !maxsize) {
    return prefPrompts.changeLoggerPrompt();
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

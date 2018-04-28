const inquirer = require('inquirer');
const validator = require('validator');
const path = require('path');
const PromptGenerator = require('../../utils/PromptGenerator');

const defaultPrefPath = path.join(__dirname, '../../../default-prefs.json');
const defaultPrefs = JSON.parse(require('fs').readFileSync(defaultPrefPath, 'utf8'));

const { supportedLanguages } = defaultPrefs;


const changeLangFlag = (lang) => {
  if (supportedLanguages.indexOf(lang) === -1) {
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

const getHostPrompt = () => {
  const hostPromptGenerator = new PromptGenerator();
  hostPromptGenerator.addProperty('name', 'host');
  hostPromptGenerator.addProperty('type', 'input');
  hostPromptGenerator.addProperty('message', 'Enter the host:');
  hostPromptGenerator.addProperty('validate', hostValidator);
  return hostPromptGenerator.getPrompt();
};

const getPortPrompt = () => {
  const portPromptGenerator = new PromptGenerator();
  portPromptGenerator.addProperty('name', 'port');
  portPromptGenerator.addProperty('type', 'input');
  portPromptGenerator.addProperty('message', 'Enter the port:');
  portPromptGenerator.addProperty('validate', portValidator);
  return portPromptGenerator.getPrompt();
};

const getTypePrompt = () => {
  const typePromptGenerator = new PromptGenerator();
  typePromptGenerator.addProperty('name', 'type');
  typePromptGenerator.addProperty('type', 'list');
  typePromptGenerator.addProperty('message', 'Choose the server type:');
  typePromptGenerator.addProperty('choices', ['gitlab', 'ms']);
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
    return {
      name: 'invalid_host',
    };
  }
  if (!portValidator(port, true)) {
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

const changeServer = async (options) => {
  let { host, port, type } = options;
  if (!type) {
    const typePrompt = getTypePrompt();
    type = (await inquirer.prompt(typePrompt)).type;
  }
  if (type === 'ms') {
    if (!host || !port) {
      return changeMainServerPrompt();
    }
    return changeMainServerFlag(host, port);
  } else if (type === 'gitlab') {
    if (!host) {
      return changeGitlabPrompt();
    }
    return changeGitlabFlag(host);
  }
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
  }
};

module.exports = {
  getInput,
};

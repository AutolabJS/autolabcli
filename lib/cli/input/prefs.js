const inquirer = require('inquirer');
const validator = require('validator');
const PromptGenerator = require('../../utils/PromptGenerator');

const defaultPrefPath = require('path').join(__dirname, '..', '..', '..', 'default-prefs.json');
const defaultPrefs = JSON.parse(require('fs').readFileSync(defaultPrefPath, 'utf8'));
const {supportedLanguages} = defaultPrefs;


const changelangFlag = (lang) => {
  if (supportedLanguages.indexOf(lang) === -1) {
    return {
      name: 'invalid_lang',
      details: {
        supportedLanguages
      }
    };
  }
  return {
    name: 'lang_changed',
    details: {
      lang: lang
    }
  };
}

const changelangPrompt = async () => {
  const langPromptGenerator = new PromptGenerator();
  langPromptGenerator.addProperty('name', 'lang');
  langPromptGenerator.addProperty('type', 'list');
  langPromptGenerator.addProperty('message', 'Chose your preferred language:');
  langPromptGenerator.addProperty('choices', supportedLanguages);

  const newLang = await inquirer.prompt(langPromptGenerator.getPrompt());
  return {
    name: 'lang_changed',
    details: {
      lang: newLang.lang
    }
  };
}

const changelang = async (options) => {
  if (options.lang) {
    return changelangFlag(options.lang);
  }
  return changelangPrompt();
}

const hostValidator = (host, flags) => {
  if (validator.isFQDN(host) || validator.isIP(host)) {
    return true;
  }
  return flags === true ? false : 'Enter a valid hostname or IP';
}

const portValidator = (port, flags) => {
  if (validator.isPort(port)) {
    return true;
  }
  return flags === true ? false : 'Enter a valid port';
}

const changeserverPrompt = async () => {
  const hostPromptGenerator = new PromptGenerator();
  hostPromptGenerator.addProperty('name', 'host');
  hostPromptGenerator.addProperty('type', 'input');
  hostPromptGenerator.addProperty('message', 'Enter the host:');
  hostPromptGenerator.addProperty('validate', hostValidator);
  const portPromptGenerator = new PromptGenerator();
  portPromptGenerator.addProperty('name', 'port');
  portPromptGenerator.addProperty('type', 'input');
  portPromptGenerator.addProperty('message', 'Enter the port:');
  portPromptGenerator.addProperty('validate', portValidator);

  const prompts = [
    hostPromptGenerator.getPrompt(),
    portPromptGenerator.getPrompt()
  ];
  const serverPrefs = await inquirer.prompt(prompts);
  return {
    name: 'server_changed',
    details: {
      host: serverPrefs.host,
      port: serverPrefs.port
    }
  }
}

const changeserverFlag = (host, port) => {
  if (!hostValidator(host, true)) {
    return {
      name: 'invalid_host'
    };
  }
  if (!portValidator(port, true)) {
    return {
      name: 'invalid_port'
    }
  }
  return {
    name: 'server_changed',
    details: {
      host,
      port
    }
  };
}

const changeserver = async (options) => {
  const {host, port} = options;
  if (!host || !port) {
    return changeserverPrompt();
  }
  return changeserverFlag(host, port);

}

const getInput = async (args, options) => {
  switch (args.preference) {
    case 'changelang':
      return await changelang(options);
    case 'changeserver':
      return await changeserver(options);
    case 'show':
      return {
        name: 'show_prefs'
      };
  }
}

module.exports = {
  getInput
}

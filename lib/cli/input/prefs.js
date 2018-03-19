const inquirer = require('inquirer');
const PromptGenerator = require('../../utils/PromptGenerator');

const defaultPrefPath = require('path').join(__dirname, '..', '..', '..', 'default-prefs.json');
const defaultPrefs = JSON.parse(require('fs').readFileSync(defaultPrefPath, 'utf8'));
const {supportedLanguages} = defaultPrefs;

const changelang = async () => {
  const langPromptGenerator = new PromptGenerator();
  langPromptGenerator.addProperty('name', 'lang');
  langPromptGenerator.addProperty('type', 'list');
  langPromptGenerator.addProperty('message', 'Chose your preferred language:');
  langPromptGenerator.addProperty('choices', supportedLanguages);
  const newLang = await inquirer.prompt(langPromptGenerator.getPrompt());
  return newLang.lang;
}

const changeserver = (url, port) => {
  if (!url) {
    return {
      name: 'no_url'
    };
  }
  if (isNaN(port)) {
    return {
      name: 'invalid_port'
    };
  }

  return {
    name: 'server_changed',
    details: {
      host: url,
      port: port
    }
  };

}

const getInput = async (args, options) => {
  switch (args.preference) {
    case 'changelang':
      return {
        name: 'lang_changed',
        details: {
          lang: await changelang()
        }
      };
    case 'changeserver':
      return changeserver(options.url, options.port);
    case 'show':
      return {
        name: 'show_prefs'
      };
  }
}

module.exports = {
  getInput
}

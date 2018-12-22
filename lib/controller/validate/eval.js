const fs = require('fs');
const path = require('path');

const defaultPrefPath = path.join(__dirname, '../../../default-prefs.json');
const defaultPrefs = JSON.parse(fs.readFileSync(defaultPrefPath, 'utf8'));

const { supportedLanguages } = defaultPrefs;

const validate = (evalEvent) => {
  if (supportedLanguages.indexOf(evalEvent.details.lang) !== -1) {
    return {
      name: 'invalid_lang',
      details: {
        supportedLanguages,
      },
    };
  }
  return evalEvent;
};

module.exports = {
  validate,
};

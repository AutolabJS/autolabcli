const fs = require('fs');
const path = require('path');

const defaultPrefPath = path.join(__dirname, '../../../default-prefs.json');
const defaultPrefs = JSON.parse(fs.readFileSync(defaultPrefPath, 'utf8'));

const { supportedLanguages } = defaultPrefs;

const validate = (evalEvent) => {
  if (supportedLanguages.indexOf(evalEvent.details.lang) === -1) {
    return {
      name: 'invalid_lang',
      details: {
        supportedLanguages,
      },
    };
  }
  if (evalEvent.details.idNo === 'root') {
    return {
      name: 'evaluate',
      details: {
        idNo: evalEvent.details.i,
        lab: evalEvent.details.lab,
        lang: evalEvent.details.lang,
        commitHash: evalEvent.details.commitHash,
      },
    };
  }
  return {
    name: 'evaluate',
    details: {
      idNo: evalEvent.details.idNo,
      lab: evalEvent.details.lab,
      lang: evalEvent.details.lang,
      commitHash: evalEvent.details.commitHash,
    },
  };
};

module.exports = {
  validate,
};

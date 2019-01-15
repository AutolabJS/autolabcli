const fs = require('fs');
const path = require('path');

const defaultPrefPath = path.join(__dirname, '../../../default-prefs.json');
const defaultPrefs = JSON.parse(fs.readFileSync(defaultPrefPath, 'utf8'));

const { supportedLanguages } = defaultPrefs;

const validateRoot = (evalEvent) => {
  const {
    i, lab, lang, commitHash,
  } = evalEvent.details;
  const labDetails = { lab, lang, commitHash };
  if (i) {
    return {
      name: 'evaluate',
      details: {
        idNo: i,
        ...labDetails,
      },
    };
  }
  return {
    name: 'invalid',
  };
};

// eslint-disable-next-line max-lines-per-function
const validate = (evalEvent) => {
  const {
    idNo, lab, lang, commitHash,
  } = evalEvent.details;
  if (supportedLanguages.indexOf(lang) === -1) {
    return {
      name: 'invalid_lang',
      details: {
        supportedLanguages,
      },
    };
  }
  if (idNo === 'root') {
    return validateRoot(evalEvent);
  }
  return {
    name: 'evaluate',
    details: {
      idNo, lab, lang, commitHash,
    },
  };
};

module.exports = {
  validate,
};

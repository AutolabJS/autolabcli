const validator = require('validator');
const path = require('path');

const defaultPrefPath = path.join(__dirname, '../../../default-prefs.json');
const defaultPrefs = JSON.parse(require('fs').readFileSync(defaultPrefPath, 'utf8'));

const { supportedLanguages } = defaultPrefs;
const { logger } = require('../../utils/logger');
const preferenceManager = require('../../utils/preference-manager');

const validateLang = (changeLangEvent) => {
  if (supportedLanguages.indexOf(changeLangEvent.details.lang) === -1) {
    logger.moduleLog('debug', 'Prefs Validate', `Invalid language for changelang command ${changeLangEvent.details.lang}`);
    return {
      name: 'invalid_lang',
      details: {
        supportedLanguages,
      },
    };
  }
  return changeLangEvent;
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

const validateChangeServer = (changeServerEvent) => {
  const { host, port, type } = changeServerEvent.details;
  const supportedServers = ['ms', 'gitlab'];
  if (supportedServers.indexOf(type) === -1) {
    return {
      name: 'invalid_server',
      details: {
        supportedServers: ['ms', 'gitlab'],
      },
    };
  }
  if (!hostValidator(host, true)) {
    logger.moduleLog('debug', 'Prefs Input', `Invalid mainserver host ${host}`);
    return {
      name: 'invalid_host',
    };
  }
  if (port && !portValidator(port, true)) {
    logger.moduleLog('debug', 'Prefs Input', `Invalid mainserver port ${host}`);
    return {
      name: 'invalid_port',
    };
  }
  return changeServerEvent;
};

const keywordValidator = (keyword, flags) => {
  const { blacklist } = preferenceManager.getPreference({ name: 'cliPrefs' }).logger;
  if (!blacklist.includes(keyword)) {
    return true;
  }
  return flags === true ? false : 'Keyword already exists. Enter any other keyword';
};

const validateLogger = (changeLoggerEvent) => {
  const { keyword } = changeLoggerEvent.details;
  if (keyword && !keywordValidator(keyword, true)) {
    return {
      name: 'invalid_blacklist_keyword',
    };
  }
  return changeLoggerEvent;
};

const validateChangeTimeout = (changeTimeoutEvent) => {
  const { type, time } = changeTimeoutEvent.details;
  const supportedTimeoutTypes = Object.keys(defaultPrefs.timeouts);
  if (!supportedTimeoutTypes.includes(type)) {
    console.log('DEbug');
    return {
      name: 'invalid_timeout_type',
      details: {
        supportedTimeoutTypes,
      },
    };
  }
  if (!time || !validator.isInt(time) || !(parseInt(time, 10) > 0)) {
    return {
      name: 'invalid_timeout_duration',
    };
  }
  return changeTimeoutEvent;
};

const validate = (changePrefEvent) => {
  switch (changePrefEvent.name) {
    case 'lang_changed':
      return validateLang(changePrefEvent);
    case 'server_changed':
      return validateChangeServer(changePrefEvent);
    case 'logger_pref_changed':
      return validateLogger(changePrefEvent);
    case 'timeouts_changed':
      return validateChangeTimeout(changePrefEvent);
    default:
      return changePrefEvent;
  }
};

module.exports = {
  validate,
};

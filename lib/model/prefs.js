const preferenceManager = require('../utils/preference-manager');

const eventForShowPref = (changePrefEvent) => {
  const cliPrefs = preferenceManager.getPreference({ name: 'cliPrefs' });
  const details = {
    gitlab_host: cliPrefs.gitlab.host,
    mainserver_host: cliPrefs.main_server.host,
    mainserver_port: cliPrefs.main_server.port,
    logger_size: cliPrefs.logger.maxSize,
    logger_dir: cliPrefs.logger.logDirectory,
    logger_location: cliPrefs.logger.logLocation,
    logger_blacklist: cliPrefs.logger.blacklist,
  };
  return {
    ...changePrefEvent,
    details,
  };
};

const getPrefsObjectToStore = (prefsName, values) => ({
  name: prefsName,
  values,
});

const storeMainServer = (host, port) => {
  preferenceManager.setPreference(getPrefsObjectToStore(
    'cliPrefs',
    {
      main_server: {
        host,
        port,
      },
    },
  ));
};

const storeGitlab = (host) => {
  preferenceManager.setPreference(getPrefsObjectToStore(
    'cliPrefs',
    {
      gitlab: {
        host,
      },
    },
  ));
};

const storeServer = (details) => {
  if (details.type === 'ms') {
    storeMainServer(details.host, details.port);
  } else if (details.type === 'gitlab') {
    storeGitlab(details.host);
  }
};

const storeLoggerPref = (details) => {
  preferenceManager.setPreference(getPrefsObjectToStore(
    'loggerPrefs',
    {
      logger: {
        blacklist: {
          keyword: details.keyword,
        },
        maxSize: +details.maxSize,
      },
    },
  ));
};

const storePrefs = (changePrefEvent) => {
  if (changePrefEvent.name === 'lang_changed') {
    preferenceManager.setPreference(getPrefsObjectToStore(
      'cliPrefs',
      {
        submission: {
          language: changePrefEvent.details.lang,
        },
      },
    ));
  } else if (changePrefEvent.name === 'server_changed') {
    storeServer(changePrefEvent.details);
  } else if (changePrefEvent.name === 'show_prefs') {
    return eventForShowPref(changePrefEvent);
  } else if (changePrefEvent.name === 'logger_pref_changed') {
    storeLoggerPref(changePrefEvent.details);
  }
  return changePrefEvent;
};

module.exports = {
  storePrefs,
};

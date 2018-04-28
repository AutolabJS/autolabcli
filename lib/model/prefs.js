const preferenceManager = require('../utils/preference-manager');

const eventForShowPref = (changePrefEvent) => {
  const cliPrefs = preferenceManager.getPreference({ name: 'cliPrefs' });
  changePrefEvent.details = {
    gitlab_host: cliPrefs.gitlab.host,
    mainserver_host: cliPrefs.main_server.host,
    mainserver_port: cliPrefs.main_server.port,
  };
  return changePrefEvent;
};

const storePrefs = (changePrefEvent) => {
  if (changePrefEvent.name === 'lang_changed') {
    preferenceManager.setPreference({
      name: 'cliPrefs',
      values: {
        submission: {
          language: changePrefEvent.details.lang,
        },
      },
    });
  } else if (changePrefEvent.name === 'server_changed') {
    if (changePrefEvent.details.type === 'ms') {
      preferenceManager.setPreference({
        name: 'cliPrefs',
        values: {
          main_server: {
            host: changePrefEvent.details.host,
            port: changePrefEvent.details.port,
          },
        },
      });
    } else if (changePrefEvent.details.type === 'gitlab') {
      preferenceManager.setPreference({
        name: 'cliPrefs',
        values: {
          gitlab: {
            host: changePrefEvent.details.host,
          },
        },
      });
    }
  } else if (changePrefEvent.name === 'show_prefs') {
    changePrefEvent = eventForShowPref(changePrefEvent);
  }
  return changePrefEvent;
};

module.exports = {
  storePrefs,
};

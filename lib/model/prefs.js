const preferenceManager = require('../utils/preference-manager');

const eventForShowPref = (changePrefEvent) => {
  const cliPrefs = preferenceManager.getPreference({name: 'cliPrefs'});
  changePrefEvent.details = {
    lang: cliPrefs.submission.language,
    mainserver_host: cliPrefs.main_server.host,
    mainserver_port: cliPrefs.main_server.port
  }
  return changePrefEvent;
}

const storePrefs = (changePrefEvent) => {
  if (changePrefEvent.name === 'lang_changed') {
    preferenceManager.setPreference({
      name: 'cliPrefs',
      values: {
        submission: {
          language: changePrefEvent.details.lang
        }
      }
    });
  }
  else if (changePrefEvent.name === 'server_changed') {
    preferenceManager.setPreference({
      name: 'cliPrefs',
      values: {
        main_server: changePrefEvent.details
      }
    });
  }
  else if (changePrefEvent.name === 'show_prefs') {
    changePrefEvent = eventForShowPref(changePrefEvent);
  }
  return changePrefEvent;
}

module.exports = {
  storePrefs
}

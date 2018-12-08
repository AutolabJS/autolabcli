const Preferences = require('preferences');
const _ = require('lodash');
const path = require('path');
const os = require('os');

const prefDirectory = `${os.homedir()}/.autolabjs`;

const defaultPrefPath = path.join(__dirname, '../../default-prefs.json');
const defaultPrefs = JSON.parse(require('fs').readFileSync(defaultPrefPath, 'utf8'));

const defaultLang = defaultPrefs.submission.language;
const defaultMainServer = defaultPrefs.main_server;
const defaultGitlab = defaultPrefs.gitlab;
const defaultLogger = defaultPrefs.logger;

const cliPrefs = new Preferences('autolabjs.cli.config', {}, {
  encrypt: false,
  file: `${prefDirectory}/cli-prefs.json`,
  format: 'json',
});

const gitLabPrefs = new Preferences('autolabjs.gitlab.credentials', {}, {
  encrypt: true,
  file: `${prefDirectory}/gitlab-credentials`,
});

const deleteCredentials = () => {
  gitLabPrefs.username = '';
  gitLabPrefs.password = '';
  gitLabPrefs.privateToken = '';
  gitLabPrefs.storedTime = -1;
  gitLabPrefs.save();
};

const storeGitlabPrefs = (values) => {
  _.assign(gitLabPrefs, values);

  gitLabPrefs.storedTime = Date.now();
  gitLabPrefs.save();
};

const assignValidtor = (objValue, srcValue) => (srcValue || objValue);

const storeLoggerPrefs = (values) => {
  const modValues = values;
  const { blacklist } = modValues.logger;
  if (blacklist && blacklist.keyword) {
    if (_.isArray(blacklist.keyword)) {
      _.assign(cliPrefs, {
        logger: {
          blacklist: blacklist.keyword,
        },
      });
    } else {
      cliPrefs.logger.blacklist.push(blacklist.keyword);
    }
  }

  modValues.logger = _.omit(modValues.logger, 'blacklist');
  _.assignWith(cliPrefs.logger, modValues.logger, assignValidtor);
  cliPrefs.save();
};

const setDefaultGitlabHost = () => {
  _.assign(cliPrefs, {
    gitlab: {
      host: defaultGitlab.host,
    },
  });
};

const setDefaultLanguage = () => {
  _.assign(cliPrefs, {
    submission: {
      language: defaultLang,
    },
  });
};

const setDefaultMainServer = () => {
  _.assign(cliPrefs, {
    main_server: {
      host: defaultMainServer.host,
      port: defaultMainServer.port,
    },
  });
};

const setDefaultLogger = () => {
  storeLoggerPrefs({
    logger: {
      maxSize: defaultLogger.maxSize,
      logDirectory: defaultLogger.logDirectory,
      logLocation: defaultLogger.logLocation,
      blacklist: {
        keyword: defaultLogger.blacklist,
      },
    },
  });
};

const setDefaultPreferences = () => {
  if (!cliPrefs.gitlab) {
    setDefaultGitlabHost();
  }
  if (!cliPrefs.submission) {
    setDefaultLanguage();
  }
  if (!cliPrefs.main_server) {
    setDefaultMainServer();
  }
  if (!cliPrefs.logger) {
    setDefaultLogger();
  }
  cliPrefs.save();
};

const getPreference = (options) => {
  switch (options.name) {
    case 'gitLabPrefs':
      return gitLabPrefs;
    case 'cliPrefs':
      return cliPrefs;
    default:
      return {};
  }
};

const setPreference = (options) => {
  switch (options.name) {
    case 'gitLabPrefs':
      storeGitlabPrefs(options.values);
      return;
    case 'cliPrefs':
      _.assign(cliPrefs, options.values);
      cliPrefs.save();
      return;
    case 'loggerPrefs':
      storeLoggerPrefs(options.values);
      return;
    default:
      setDefaultPreferences();
  }
};

module.exports = {
  deleteCredentials,
  getPreference,
  setPreference,
};

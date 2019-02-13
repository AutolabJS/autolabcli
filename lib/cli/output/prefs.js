const chalk = require('chalk');
const Table = require('cli-table');

const showPrefs = (prefs) => {
  const prefsColWidth = 30;
  const valuesColWidth = 27;
  const table = new Table({
    head: [chalk.cyan('Preferences'), chalk.cyan('Values')],
    colWidths: [prefsColWidth, valuesColWidth],
  });
  table.push(
    ['Gitlab host', prefs.gitlab_host],
    ['Main Server host', prefs.mainserver_host],
    ['Main Server port', prefs.mainserver_port],
    ['Logger file MaxSize', prefs.logger_size],
    ['Log file Directory', prefs.logger_dir],
    ['Log file name', prefs.logger_location],
    ['Logger blacklist keys', prefs.logger_blacklist],
    ['Session duration (seconds)', prefs.timeouts_session],
  );
  console.log(table.toString());
};

const showServerChange = (event) => {
  if (event.details.type === 'ms') {
    console.log(chalk.green(`Your main server has been changed to ${event.details.host} at port ${event.details.port}`));
  } else if (event.details.type === 'gitlab') {
    console.log(chalk.green(`Your gitlab server has been changed to ${event.details.host}`));
  }
};

const showTimeoutChange = ({ type, time }) => {
  if (type === 'session') {
    console.log(chalk.green(`Your session duration has been changed to ${time} seconds`));
  }
};

// eslint-disable-next-line max-lines-per-function
const sendOutput = (event) => {
  switch (event.name) {
    case 'lang_changed':
      console.log(chalk.green(`Your submission language has been changed to ${event.details.lang}`));
      break;
    case 'server_changed':
      showServerChange(event);
      break;
    case 'show_prefs':
      showPrefs(event.details);
      break;
    case 'logger_pref_changed':
      console.log(chalk.green('Your logger preferences have been updated.'));
      break;
    case 'timeouts_changed':
      showTimeoutChange(event.details);
      break;
    case 'invalid_lang':
      console.log(chalk.red(`Please provide the a valid language. The supported languages are ${event.details.supportedLanguages}`));
      break;
    case 'invalid_host':
      console.log(chalk.red('Please provide a valid host'));
      break;
    case 'invalid_port':
      console.log(chalk.red('Please provide a valid port'));
      break;
    case 'invalid_blacklist_keyword':
      console.log(chalk.red('Keyword already exixts, please provide valid blacklist keyword'));
      break;
    case 'invalid_server':
      console.log(chalk.red(`Please provide a valid server for config. The valid servers are ${event.details.supportedServers}`));
      break;
    case 'invalid_timeout_type':
      console.log(chalk.red(`Please provide a valid timeout. The valid timeout(s) are ${event.details.supportedTimeoutTypes}`));
      break;
    case 'invalid_timeout_duration':
      console.log(chalk.red('Please specify the time in seconds as a positive integer'));
      break;
    case 'invalid_command':
      console.log(chalk.red('Please provide a valid command'));
      break;
    default:
      console.log(chalk.red('\nInvalid Event'));
  }
};

module.exports = {
  sendOutput,
};

const chalk = require('chalk');
const Table = require('cli-table');

const showPrefs = (prefs) => {
  const table = new Table({
    head: [chalk.cyan('Preferences'), chalk.cyan('Values')],
    colWidths: [15, 25],
  });
  table.push(
    ['Language', prefs.lang],
    ['Server host', prefs.mainserver_host],
    ['Server port', prefs.mainserver_port],
  );
  console.log(table.toString());
};

const sendOutput = (event) => {
  switch (event.name) {
    case 'lang_changed':
      console.log(chalk.green(`Your submission language has been changed to ${event.details.lang}`));
      break;
    case 'server_changed':
      console.log(chalk.green(`Your submission server has been changed to ${event.details.host} at port ${event.details.port}`));
      break;
    case 'show_prefs':
      showPrefs(event.details);
      break;
    case 'invalid_lang':
      console.log(chalk.red(`Please provide the a valid language. The supported languages are ${event.details.supportedLanguages}`));
      break;
    case 'invalid_host':
      console.log(chalk.red('Please provide a valid host'));
      break;
    case 'invalid_port':
      console.log(chalk.red('Please provide a valid port'));
  }
};

module.exports = {
  sendOutput,
};

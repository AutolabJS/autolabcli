const chalk = require('chalk');
const Table = require('cli-table');

const showPrefs = (prefs) => {
  const table = new Table({
    head: [chalk.cyan('Preferences'), chalk.cyan('Values')],
    colWidths: [20, 25],
  });
  table.push(
    ['Gitlab host', prefs.gitlab_host],
    ['Main Server host', prefs.mainserver_host],
    ['Main Server port', prefs.mainserver_port],
  );
  console.log(table.toString());
};

const sendOutput = (event) => {
  switch (event.name) {
    case 'lang_changed':
      console.log(chalk.green(`Your submission language has been changed to ${event.details.lang}`));
      break;
    case 'server_changed':
      if (event.details.type === 'ms') {
        console.log(chalk.green(`Your main server has been changed to ${event.details.host} at port ${event.details.port}`));
      } else if (event.details.type === 'gitlab') {
        console.log(chalk.green(`Your gitlab server has been changed to ${event.details.host}`));
      }
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

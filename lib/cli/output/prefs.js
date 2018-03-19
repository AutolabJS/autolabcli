const chalk = require('chalk');
const Table = require('cli-table');

const showPrefs = (prefs) => {
  const table = new Table({
      head: [chalk.cyan('Preferences'), chalk.cyan('Values')]
    , colWidths: [15, 25]
  });
  table.push(
    ['Language', prefs.lang],
    ['Server url', prefs.mainserver_host],
    ['Server port', prefs.mainserver_port]
  );
  console.log(table.toString());
}

const sendOutput = (event) => {
  switch (event.name) {
    case 'lang_changed':
      console.log(chalk.green(`Your submission language has been chaged to ${event.details.lang}`));
      break;
    case 'server_changed':
      console.log(chalk.green(`Your submission server has been chaged to ${event.details.host} at port ${event.details.port}`));
      break;
    case 'show_prefs':
      showPrefs(event.details);
      break;
    case 'no_url':
      console.log(chalk.red(`Please provide the url of the new server`));
      break;
    case 'invalid_port':
      console.log(chalk.red(`Please provide the a valid port of the new server`));
  }
}

module.exports = {
  sendOutput
}

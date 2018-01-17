const chalk = require('chalk');
const figlet = require('figlet');

module.exports = {

  sendWelcome: () => {
    console.log(
      chalk.yellow(
        figlet.textSync('Autolab CLI', { horizontalLayout: 'full' })
			)
		);
  },

  sendResult: (output) => {
    console.log(output);
  }
}

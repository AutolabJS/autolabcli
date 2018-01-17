const chalk = require('chalk');
const figlet = require('figlet');

const sendWelcome = () => {
  console.log(
    chalk.yellow(
      figlet.textSync('Autolab CLI', { horizontalLayout: 'full' })
    )
  );
}

const sendResult = (username, password) => {
  username = chalk.blue(username);
  password = chalk.red(password);
  console.log(`Your username is: ${username}\nYour password is: ${password}`);
}

module.exports = {
  sendResult,
  sendWelcome
}

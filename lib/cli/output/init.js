const chalk = require('chalk');
const figlet = require('figlet');

const sendWelcome = () => {

  const figletText = figlet.textSync('Autolab CLI', { horizontalLayout: 'full' });
  const yellowFiglet = chalk.yellow(figletText);
  console.log(yellowFiglet);

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

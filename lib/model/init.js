const chalk = require('chalk');

class InitModel {
  static async getOutputString(username, password) {
    username = chalk.blue(username);
    password = chalk.red(password);
    return `Your username is: ${username}\nYour password is: ${password}`;
  }
}

module.exports = InitModel;

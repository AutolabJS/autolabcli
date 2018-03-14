const program = require('caporal');
const preferenceManager = require('../utils/preference-manager');;

const init = require('./init');
const exit = require('./exit');


const start = () => {
    preferenceManager.setDefaultPreferences();
    program
      .version('1.0.0')
      .description('A Command Line Interface (CLI) for AutolabJS');

    init.addTo(program);
    exit.addTo(program);

    program.parse(process.argv);
  }

module.exports = {
  start
}

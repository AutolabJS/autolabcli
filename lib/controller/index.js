const program = require('caporal');
const preferenceManager = require('../utils/preference-manager');

const init = require('./init');
const exit = require('./exit');
const prefs = require('./prefs');


const start = async () => {
  preferenceManager.setPreference({
    name: 'default',
  });
  program
    .version('1.0.0')
    .description('A Command Line Interface (CLI) for AutolabJS');

  init.addTo(program);
  exit.addTo(program);
  prefs.addTo(program);

  await program.parse(process.argv);
};

module.exports = {
  start,
};

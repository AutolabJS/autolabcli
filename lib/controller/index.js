const program = require('caporal');
const preferenceManager = require('../utils/preference-manager');
const { logger } = require('../utils/logger');

const init = require('./init');
const exit = require('./exit');
const prefs = require('./prefs');
const evaluate = require('./eval');
const show = require('./show');


const start = async () => {
  preferenceManager.setPreference({
    name: 'default',
  });
  program
    .version('1.0.0')
    .logger(logger)
    .description('A Command Line Interface (CLI) for AutolabJS');

  init.addTo(program);
  exit.addTo(program);
  prefs.addTo(program);
  evaluate.addTo(program);
  show.addTo(program);

  await program.parse(process.argv);
};

module.exports = {
  start,
};

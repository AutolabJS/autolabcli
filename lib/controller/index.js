const program = require('caporal');

const init = require('./init');

module.exports = {
  start: () => {
    program
      .version('1.0.0')
      .description('A Command Line Interface (CLI) for Autolab');

    init.addTo(program);

    program.parse(process.argv);
  }
}

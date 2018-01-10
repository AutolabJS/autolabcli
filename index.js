#!/usr/bin/env node

let program = require('caporal');

const init = require('./lib/cli/init');

program
  .version('1.0.0')
  .description('A Command Line Interface (CLI) for Autolab');
init.add(program);

program.parse(process.argv);

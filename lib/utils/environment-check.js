const fs = require('fs');

const check = function check(variable) {
  if (typeof process.env[variable] === 'undefined' || process.env[variable] === null) {
    throw new Error('Path to config file is not specified.');
  }

  try {
    fs.accessSync(process.env[variable], fs.constants.R_OK);
  } catch (err) {
    throw new Error('Config file does not exists or has no read permissions.');
  }
};

module.exports = {
  check,
};

const initInput = require('../cli/input/init');
const initOutput = require('../cli/output/init');
const initModel = require('../model/init');

module.exports = {
   addTo: (program) => {
     program
      .command('init', 'Initialize the directory as git repository and login to autolab system')
      .option('-u <username>', 'Login <username> for Autolab')
      .option('-p <password>', 'Login <password> for Autolab')
      .action(onInit);
  }
}

const onInit = (args, options, logger) => {
    initInput.getInput(args, options)
      .then( answer => initModel.getOutputString(answer.username, answer.password))
      .then( output => initOutput.send(output, logger));
}

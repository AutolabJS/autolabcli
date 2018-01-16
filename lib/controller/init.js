const initInput = require('../cli/input/init');
const initOutput = require('../cli/output/init');
const initModel = require('../model/init');

const onInit = async (args, options, logger) => {
    const answer = await initInput.getInput(args, options);
    const output = await initModel.getOutputString(answer.username, answer.password);
    initOutput.send(output);
}

module.exports = {
   addTo: (program) => {
     program
      .command('init', 'Initialize the directory as git repository and login to autolab system')
      .option('-u <username>', 'Login <username> for Autolab')
      .option('-p <password>', 'Login <password> for Autolab')
      .action(onInit);
  }
}

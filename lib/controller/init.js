const initInput = require('../cli/input/init');
const initOutput = require('../cli/output/init');
const initModel = require('../model/init');

const onInit = async (args, options, logger) => {
    initOutput.sendWelcome();
    const answer = await initInput.getInput(args, options);
    const output = await initModel.getOutputString(answer.username, answer.password);
    initOutput.sendResult(output);
}

module.exports = {
   addTo: (program) => {
     program
      .command('init', 'Initialize the directory as git repository and login to AutolabJS system')
      .option('-u <username>', 'Login <username> for AutolabJS')
      .option('-p <password>', 'Login <password> for AutolabJS')
      .action(onInit);
  }
}

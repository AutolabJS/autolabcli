const initInput = require('../cli/input/init');
const initOutput = require('../cli/output/init');
const initModel = require('../model/init');

const onInit = async (args, options, logger) => {
    initOutput.sendWelcome();
    const answer = await initInput.getInput(args, options);
    initOutput.sendResult(answer.username, answer.password);
}

const addTo = (program) => {
  program
   .command('init', 'Initialize the directory as git repository and login to AutolabJS system')
   .option('-u <username>', 'Login <username> for AutolabJS')
   .option('-p <password>', 'Login <password> for AutolabJS')
   .action(onInit);
}

module.exports = {
  addTo
}

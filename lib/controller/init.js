const initInput = require('../cli/input/init');
const initOutput = require('../cli/output/init');
const initModel = require('../model/init');

const onInit = async (args, options, logger) => {

  initOutput.sendOutput({
    name: 'welcome'
  });

  const credentials = await initInput.getInput(args, options);
  initOutput.sendOutput({
    name: 'authentication_started'
  });

  let status = await initModel.authenticate(credentials);

  initOutput.sendOutput({
    name: 'authentication_ended',
    details: {
      ...status
    }
  });
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

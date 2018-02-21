const initInput = require('../cli/input/init');
const initOutput = require('../cli/output/init');
const initModel = require('../model/init');
const preferenceManager = require('../utils/preference-manager');

const fetchTokenandStore = async (answer) => {
  try {
    const {privateToken, name} = await initModel.fetchPrivateToken(preferenceManager.getHost(), answer.username, answer.password);
    preferenceManager.storeGitLabCredentials(answer.username, answer.password, privateToken);
    initOutput.sendSuccessWelcome(name);
  } catch (e) {
    handleError(e);
  }
}

const handleError = (e) => {
  if (!e.statusCode)
    initOutput.sendError('\nPlease check your network connection');
  else if (e.statusCode !== 200)
    initOutput.sendError('\nInvalid Username or Password');
}

const onInit = async (args, options, logger) => {
    initOutput.sendWelcome();
    const answer = await initInput.getInput(args, options);
    initOutput.startSpinner();
    await fetchTokenandStore(answer);
    initOutput.stopSpinner();
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

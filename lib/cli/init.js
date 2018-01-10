const init = require('../model/init');

module.exports = {
   add: (program) => {
     program
      .command('init', 'Initialize the directory as git repository and login to autolab system')
      .option('-u <username>', 'Login <username> for Autolab')
      .option('-p <password>', 'Login <password> for Autolab')
      .action(init);
  }
}

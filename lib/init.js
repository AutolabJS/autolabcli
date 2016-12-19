var chalk = require('chalk');
var clear = require('clear');
var figlet = require('figlet');
var inquirer = require('inquirer');
var Preferences = require('preferences');
var Spinner = require('cli-spinner').Spinner;
var _ = require('lodash');
var git = require('simple-git')();
var fs = require('fs');
var request = require('request');
var rev = require('./rev');

module.exports = function(callback) {
	clear();
	prefs = new Preferences('in.ac.bits-goa.autolab');
	console.log('Working on host ' + hostpref.host.host);
	console.log(
		chalk.yellow(
			figlet.textSync('Autolab', { horizontalLayout: 'full' })
			)
		);

	var questions = [
	{
		name: 'username',
		type: 'input',
		message: 'Enter your GitLab username',
		validate: function(value) {
			if (value.length) {
				return true;
			}
			else {
				return 'Please enter your username';
			}
		}
	},
	{
		name: 'password',
		type: 'password',
		message: 'Enter your password:',
		validate: function(value) {
			if (value.length) {
				return true;
			}
			else {
				return 'Please enter your password';
			}
		}
	},
	];
	
	if (prefs.gitlab && Math.floor(Date.now() / 1000) - prefs.gitlab.time < 7200 && Math.floor(Date.now() / 1000) - prefs.gitlab.time > 0) {
		timeLeft = 120 - ((Math.floor(prefs.gitlab.time < 7200 && Math.floor(Date.now() / 1000) - prefs.gitlab.time)/60));
		console.log(chalk.blue("You are already authenticated. If this is not you, or you want to exit the session, use 'autolab exit'. Session will expire in " + timeLeft + ' minutes'));
	}
	else {
		inquirer.prompt(questions).then(function(answers) {
			var status = new Spinner('Authenticating you, please wait ...');
			status.setSpinnerString(0);
			pass = arguments['0'].password;
			username = arguments['0'].username;
			status.start();
			request.post(
				hostpref.host.host +'/api/v3/session?login=' + username + '&password=' + pass,
				function (error, response, body) {
					status.stop();
					token = JSON.parse(body).private_token;
					if (!token ) {
						console.log(chalk.red('Invalid Username or Password'));
						process.exit(0);
					}
					else {
						prefs.gitlab = {
							name: JSON.parse(body).name.split(' ')[0],
							username: JSON.parse(body).username,
							password: pass,
							token: token,
							time: Math.floor(Date.now() / 1000)
						};
						console.log(chalk.green('\nSuccessfully authenticated!'));
						if (!('.git' in _.without(fs.readdirSync('.')))) {
							git.init();
						}
						console.log(chalk.white('Hi ' + JSON.parse(body).name.split(' ')[0] + ", proceed to making commits in this repository. See 'autolab --help' for help."));
						console.log(chalk.blue("Your session will be active for the next two hours. Use 'autolab exit' to exit the session."));
					}
				});
		});
	} 
};
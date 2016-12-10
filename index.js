#!/usr/bin/env node
var chalk = require('chalk');
var clear = require('clear');
var CLI = require('clui');
var figlet = require('figlet');
var inquirer = require('inquirer');
var Preferences = require('preferences');
var Spinner = CLI.Spinner;
var _ = require('lodash');
var git = require('simple-git')();
var touch = require('touch');
var fs = require('fs');
var request = require('request');
var files = require('./lib/files');
var https = require('https');

hostpref = new Preferences('autolab.host');
if (!hostpref.host) {
	hostpref.host = {
		host: 'https://autolab.bits-goa.ac.in',
	}
}

function init(callback) {
	prefs = new Preferences('in.ac.bits-goa.autolab');
	console.log('Working on host ' + hostpref.host.host)
	console.log(
		chalk.yellow(
			figlet.textSync('Autolab', { horizontalLayout: 'full' })
			)
		);

	var questions = [
	{
		name: 'username',
		type: 'input',
		message: 'Enter your Gitlab username or email address:',
		validate: function(value) {
			if (value.length) {
				return true;
			}
			else {
				return 'Please enter your Gitlab username or e-mail address';
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
	}
	];

	// if (!hostpref.host) {
	// 	questions = questions.concat(
	// 	{
	// 		name: 'host',
	// 		type: 'input',
	// 		message: 'Enter the host to be accessed',
	// 		validate: function(value) {
	// 			if (value.length) {
	// 				return true;
	// 			}
	// 			else {
	// 				return 'Please enter the host';
	// 			}
	// 		}
	// 	});
	// }

	if (prefs.gitlab && prefs.gitlab.time - Math.floor(Date.now() / 1000) < 7200) {
		timeLeft = 120 + (Math.floor(prefs.gitlab.time/60) - Math.floor(Date.now() / 60000));
		console.log(chalk.blue("You are already authenticated. If this is not you, or you want to exit the session, use 'autograder exit'. Session will expire in " + timeLeft + ' minutes'));
	} else {
		inquirer.prompt(questions).then(function(answers) {
			var status = new Spinner('Authenticating you, please wait ...');
			status.start()
			var options = {
				url: hostpref.host.host +'/api/v3/session?login=' + arguments['0']['username'] + '&password=' + arguments['0']['password'],
				strictSSL: false,
				secureProtocol: 'TLSv1_method'
			}
			request.post(
				options,
				function (error, response, body) {
					status.stop()
					token = JSON.parse(body)['private_token'];
					if (!token ) {
						console.log(chalk.red('Invalid Username or Password'))
						init();
					} else {
						prefs.gitlab = {
							name: JSON.parse(body)['name'].split(' ')[0],
							username: JSON.parse(body)['username'],
							token: token,
							time: Math.floor(Date.now() / 1000)
						};
						console.log(chalk.green('Successfully authenticated!'));
						git.init();
						console.log(chalk.white('Hi ' + JSON.parse(body)['name'].split(' ')[0] + ", proceed to making commits in this repository. See 'autograder --help' for help."));
						console.log(chalk.blue("Your session will be active for the next two hours. Use 'autograder exit' to exit the session."));
					}
				});
		});
	} 
}

function changeHost() {
	var hostname = [
	{
		name: 'host',
		type: 'input',
		message: 'Host name: ',
		default: hostpref.host.host,

	}]

	inquirer.prompt(hostname).then(function(answers) {
		hostpref.host = {
			host: arguments['0']['host'],
		}
	})

}

function createRepo(callback) {
	var questions = [
	{
		name: 'lab',
		type: 'input',
		message: 'Enter the Lab No. to be created',
		validate: function(value) {
			if (value.length) {
				return true;
			}
			else {
				return 'Please enter the Lab No.';
			}
		}
	}];
	inquirer.prompt(questions).then(function (answers) {
		var prefs = new Preferences('in.ac.bits-goa.autolab');
		var labno = 'lab' + arguments['0']['lab'];
		var options = {
				url: hostpref.host.host +'/api/v3/projects?private_token=' + prefs.gitlab.token,
				strictSSL: false,
				secureProtocol: 'TLSv1_method'
			}
		request.post(
			options,
			{ json: {'name' : labno}},
			function (error, response, body) {
				if (response.statusCode == 201) {
					console.log(chalk.green('Successfully created online repo ' + labno));
					git.addRemote('autolab', hostpref.host.host +'/' + prefs.gitlab.username + '/' + labno);
				}
				if (response.statusCode == 401 || response.statusCode == 403 ) {
					console.log(chalk.red("Authentication problem!. Use 'autograder init' to authenticate." ))
				}
				if (response.statusCode == 400) {
					console.log(chalk.yellow("Already created " + labno))
				}

		});
	});
}

function deleteRepo(callback) {
	var questions = [
	{
		name: 'lab',
		type: 'input',
		message: 'Enter the Lab No. to be deleted',
		validate: function(value) {
			if (value.length) {
				return true;
			}
			else {
				return 'Please enter the Lab No.';
			}
		}
	}];
	inquirer.prompt(questions).then(function (answers) {
		var prefs = new Preferences('in.ac.bits-goa.autolab');
		var labno = 'lab' + arguments['0']['lab'];
		var options = {
			url: hostpref.host.host +'/projects/' + prefs.gitlab.username + '%2F' +labno +'?private_token=' + prefs.gitlab.token,
			strictSSL: false,
			secureProtocol: 'TLSv1_method'
		}
		request.delete(
			options,
			function (error, response, body) {
				if (response.statusCode == 201) {
					console.log(chalk.green('Successfully deleted' + labno));
				}
				if (response.statusCode == 401 || response.statusCode == 403 ) {
					console.log(chalk.red("Authentication problem!. Use 'autograder init' to authenticate." ))
				}
				if (response.statusCode == 400) {
					console.log(chalk.yellow("No online repo with the name " + labno))
				}
		});
	});
}

function push() {
	var questions = [
	{
		name: 'message',
		type: 'input',
		message: 'Enter the commit message',
		validate: function(value) {
			if (value.length) {
				return true;
			}
			else {
				return 'Please enter commit message';
			}
		}
	}];

	inquirer.prompt(questions).then(function (answers) {
		var status = new Spinner('Pushing the code');
		status.start();
		git.add('./*').commit(arguments[0]['message']).push('autolab', 'master');
		status.stop();
	});
}

var argv = require('minimist')(process.argv.slice(2));

if (argv._[0] == 'init') {
	init();
} else if (argv._[0] == 'online') {
	if (argv._[1] == 'create') {
		createRepo();
	}
	if (argv._[1] == 'delete') {
		deleteRepo();
	}
	if (argv._[1] == 'changehost') {
		changeHost();
	}
} else if (argv._[0] == 'push') {
	push();
}else if (argv._[0] == 'exit'){
	var prefs = new Preferences('in.ac.bits-goa.autolab');
	prefs.gitlab = {
		token: '',
		time: Math.floor(Date.now() / 1000) + 9999
	};
	console.log('Successfully exited!')

}
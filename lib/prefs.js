var inquirer = require('inquirer');
var Preferences = require('preferences');

/**
* @exports function as object
*/
/**
* Function to change the language for the solution submitted
* @function changeLang
* @param {null}
* @return {null}
*/
module.exports.changeLang = function() {
	var language = [
	{
		name: 'lang',
		type: 'input',
		message: 'Language: ',
		default: hostpref.host.lang,
	}];

	inquirer.prompt(language).then(function(answers) {
		hostpref.host.lang = arguments['0'].lang;
		console.log('Successfully changed the language');
	});
};

/**
* @exports function as object
*/
/**
* Function to change the Host for the solution submitted
* @function changeHost
* @param {null}
* @return {null}
*/
module.exports.changeHost = function() {
	var hostname = [
	{
		name: 'host',
		type: 'input',
		message: 'Host name: ',
		default: hostpref.host.host,

	}];

	inquirer.prompt(hostname).then(function(answers) {
		hostpref.host.host = arguments['0'].host;
		console.log('Successfully changed the host');
	});
};

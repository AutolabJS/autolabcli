var Table = require('cli-table');
var chalk = require('chalk')
var helpjson = {
	'init' 				: 'Initializes local repository and authenticates',
	'exit'				: 'Wipes off the credentials from the system',
	'git create'		: 'Creates a repository on Gitlab',
	'git delete'		: 'Deletes the specified repository from Gitlab',
	'git changeserver'	: 'To change the host of Gitlab',
	'git changelang'	: 'To change the language of the code submission',
	'git push'			: 'Adds, commits, pushes the code',
	'submit'			: 'To submit the code to JavaAutolab and fetch the results',
	'help'				: 'Print help manual'
}
module.exports = function() {
	console.log('\n' + chalk.blue('Usage:') + ' autolab [OPTIONS]');
	var table = new Table({
		head: ['Options:', ''],
		colWidths: [20,70]
	});
	for (var key in helpjson)
	table.push(
		[key,helpjson[key]]
		);
	console.log(table.toString());
}
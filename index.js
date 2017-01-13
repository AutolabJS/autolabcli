#!/usr/bin/env node
var clear = require('clear');
var Preferences = require('preferences');
var _ = require('lodash');
var touch = require('touch');
var fs = require('fs');

var init = require('./lib/init');
var git = require('./lib/git');
var submit = require('./lib/submit');
var rev = require('./lib/rev');
var help = require('./lib/help');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

touch('.gitignore');
var conf = 0;
fs.readFile('.gitignore', function (err, data) {
  if (err) throw err;
  if(data.indexOf('.config.json') < 0) {
  	fs.appendFile('.gitignore', '\n.config.json', function (err) {});
  }
});

hostpref = new Preferences('autolab.host');
//Also accounted for backward compatibility
if (!hostpref.host || !hostpref.host.host || !hostpref.host.lang) {
	hostpref.host = {
		host: 'https://autolab.bits-goa.ac.in',
		lang: 'java',
	};
}

var argv = require('minimist')(process.argv.slice(2));

if (argv._[0] == 'init') {
	init();
}
else if (argv._[0] == 'git') {
	if (argv._[1] == 'create') {
		git.createRepo();
	}
	if (argv._[1] == 'delete') {
		git.deleteRepo();
	}
	if (argv._[1] == 'changeserver') {
		git.changeHost();
	}
	if (argv._[1] == 'push') {
		git.push();
	}
	if (argv._[1] == 'changelang') {
		git.changeLang();
	}
}
else if (argv._[0] == 'submit') {
	submit();
} 
else if (argv._[0] == 'help') {
	help();
}
else if (argv._[0] == 'exit') {
	rev.exit();
	console.log('Successfully exited!');
}
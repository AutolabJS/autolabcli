var chalk = require('chalk');
var Preferences = require('preferences');
var Spinner = require('cli-spinner').Spinner;
var git = require('simple-git')();
var Table = require('cli-table');

module.exports = function() {
	var prefs = new Preferences('in.ac.bits-goa.autolab');
	var commit_hash;
	var spinner = new Spinner('Submitting results. Please wait ...');
	spinner.setSpinnerString(0);
	git.revparse(['--verify','HEAD'], function(err, data) {
		commit_hash = data;
		spinner.start();

		var socket = require('socket.io-client')(hostpref.host.host+':'+'9000');
		socket.emit('submission', [prefs.gitlab.username, 'lab0', commit_hash, hostpref.host.lang]);
		socket.on('invalid', function(data) {
			console.log(chalk.red('Access Denied. Please try submitting again'));
			process.exit(0);
		});

		socket.on('submission_pending',function(data) {
			console.log(chalk.yellow('You have a pending submission. Please try after some time.'));
			process.exit(0);
		});

		socket.on('scores', function(data) {
			total_score=0;
			console.log(chalk.green('\nSubmission successful. Retreiving results'));
			var table = new Table({
				chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗',
				'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝', 
				'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼',
				'right': '║' , 'right-mid': '╢' , 'middle': '│' },
				head: ['Test Case #', 'Status', 'Score'],
				colWidths: [15,25,15]
			});

			for(i=0;i<data.marks.length;i++) {
		    	total_score=total_score+ parseInt(data.marks[i]);
		    	status = 'Accepted';
		    	if(data.comment[i]===0) {
		    		status='Wrong Answer';
		    	}
		    	if(data.comment[i]==1 && data.marks[i]===0) {
		    		status='Compilation Error';
		    	}
		    	if(data.comment[i]==2 && data.marks[i]===0) {
		    		status='Timeout';
		    	}
		    	table.push(
		    		[(i+1), status, data.marks[i]]
		    		);
		    }
		    console.log(table.toString());
		    if (total_score < 0) {
		    	total_score = 0;
		    }
		    if (data.status!==0) {
		    	console.log(chalk.red('Penalty:') + data.penalty);
		    }
		    console.log('Total Score = ' + chalk.blue(total_score));
		    if (data.status===0) {
		    	console.log(chalk.yellow('Warning:') + 'This lab is not active. The result of this evaluation is not added to the scoreboard.');
		    }
		    console.log(new Buffer(data.log, 'base64').toString());
		    spinner.stop();
		    process.exit(0);
		});
	});
};
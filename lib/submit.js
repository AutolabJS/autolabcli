/**
* <h3>Module contains various function to submit the solution and display the evaluated result respectively </h3>
* @module lib/submit
*/
var chalk = require('chalk');
var Preferences = require('preferences');
var Spinner = require('cli-spinner').Spinner;
var git = require('simple-git')();
var Table = require('cli-table');
/**
* @exports function as object
*/
/**
* Function does the following things : <br>
* 1. Submits the result to be evaluated<br>
* 2. Evaluates all result by checking all the answers with the given answer key
* 3. Prints the result as evaluated
* 4. Calculates and prints the total score for the given excercise
* @function submit
* @param {null}
* @return {null}
*/
module.exports = function() {
	var prefs = new Preferences('in.ac.bits-goa.autolab');
	var commit_hash;
	var spinner = new Spinner('Submitting results. Please wait ...');
	spinner.setSpinnerString(0);
	setTimeout(function() {
		console.error('The evaluation request is taking too long. Exiting now.');
		process.exit(-2);
	}, 240000);
	commit_hash = '';
	spinner.start();

	var socket = require('socket.io-client')(hostpref.host.host+':'+'9000');
	socket.emit('submission', [prefs.gitlab.username, 'test', commit_hash, hostpref.host.lang]);
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
	    	status = data.comment[i];
	    	table.push(
	    		[(i+1), status, data.marks[i]]
	    		);
	    }
	    console.log(table.toString());
	    if (total_score < 0) {
	    	total_score = 0;
	    }
	    if (data.status!==0) {
	    	console.log(chalk.red('Penalty : ') + data.penalty);
	    }
	    console.log(chalk.green('Total Score : ') + total_score);
	    if (data.status===0) {
	    	console.log(chalk.yellow('Warning :') + 'This lab is not active. The result of this evaluation is not added to the scoreboard.');
	    }
	    console.log('\n' + chalk.yellow('Log :\n') + new Buffer(data.log, 'base64').toString());
	    spinner.stop();
	    process.exit(0);
	});
};

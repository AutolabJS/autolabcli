/**
* Authenticates the user by prompting for Username and password
* @module lib/rev
*/
var Preferences = require('preferences');

prefs = new Preferences('in.ac.bits-goa.autolab');
/**
* @exports function as a object
*/
/**
* Function does the following things
* 1. Returns the minutes remaining before the current session is terminated.
* 2. If the time elapsed is more than 2 hours, it calls the exit function which terminates the current session.
* @function rev
* @param {null}
* @return {null}
*/
module.exports.check = function() {
	if (prefs.gitlab && Math.floor(Date.now() / 1000) - prefs.gitlab.time < 7200 && Math.floor(Date.now() / 1000) - prefs.gitlab.time > 0) {
		return (120 - ((Math.floor(prefs.gitlab.time < 7200 && Math.floor(Date.now() / 1000) - prefs.gitlab.time)/60)));
	}
	else {
		exit();
		return 0;
	}
};
/**
* logs out the current user and sets the time elapsed to zero
* @function exit
* @param {null}
* @return {null}
*/
var exit = function() {
	var prefs = new Preferences('in.ac.bits-goa.autolab');
	prefs.gitlab = {
		token: '',
		time: 0
	};
};

module.exports.exit = exit;

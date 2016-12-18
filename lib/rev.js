var Preferences = require('preferences');

prefs = new Preferences('in.ac.bits-goa.autolab');
module.exports.check = function() {
	if (prefs.gitlab && Math.floor(Date.now() / 1000) - prefs.gitlab.time < 7200 && Math.floor(Date.now() / 1000) - prefs.gitlab.time > 0) {
		return (120 - ((Math.floor(prefs.gitlab.time < 7200 && Math.floor(Date.now() / 1000) - prefs.gitlab.time)/60)));
	} else {
		exit();
		return 0;
	}
}

var exit = function() {
	var prefs = new Preferences('in.ac.bits-goa.autolab');
	prefs.gitlab = {
		token: '',
		time: 0
	};
}

module.exports.exit = exit();
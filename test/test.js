var prefs = require('../lib/prefs');
var mocha = require('mocha');
var expect = require('chai').expect;
var Preferences = require('preferences');
hostpref = new Preferences('autolab.host');

describe('prefs_changeHost', function() {
	var stdin;
	var prevVal = hostpref.host.host;
	beforeEach(function() {
		stdin = require('mock-stdin').stdin();
	});
	it('changes host', function() {
		process.nextTick(function() {
			stdin.send('http://test.autolab\n');
		});
		prefs.changeHost();
	});
	it('tests and changeback', function() {
		expect(hostpref.host.host).to.equal('http://test.autolab');
		process.nextTick(function() {
			stdin.send(prevVal + '\n');
		});
		prefs.changeHost();
	});
});

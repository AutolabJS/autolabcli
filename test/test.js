var git = require('../lib/git');
var mocha = require('mocha');
var expect = require('chai').expect;
var Preferences = require('preferences');
hostpref = new Preferences('autolab.host');

describe('git_changeHost', function() {
	var stdin;
	var prevVal = hostpref.host.host;
	beforeEach(function() {
		stdin = require('mock-stdin').stdin();
	});
	it('changes host', function() {
		process.nextTick(function() {
			stdin.send('http://test.autolab\n');
		});
		git.changeHost();
	});
	it('tests and changeback', function() {
		expect(hostpref.host.host).to.equal('http://test.autolab');
		process.nextTick(function() {
			stdin.send(prevVal + '\n');
		});
		git.changeHost();
	});
});

# AutoLab CLI #

[![Code Climate](https://codeclimate.com/github/prasadtalasila/autolabcli/badges/gpa.svg)](https://codeclimate.com/github/prasadtalasila/autolabcli) [![Known Vulnerabilities](https://snyk.io/test/github/autolabjs/autolabcli/badge.svg)](https://snyk.io/test/github/autolabjs/autolabcli) [![Coverage Status](https://coveralls.io/repos/github/AutolabJS/autolabcli/badge.svg?branch=dev)](https://coveralls.io/github/AutolabJS/autolabcli?branch=dev) [![Build Status](https://travis-ci.org/AutolabJS/autolabcli.svg?branch=master)](https://travis-ci.org/AutolabJS/autolabcli)    

A client command line interface for submissions to [AutolabJS](https://github.com/AutolabJS/AutolabJS).



## Commands ##
* `autolab init` - Initializes local repository and authenticates
* `autolab exit` - Wipes off the credentials from the system
* `autolab git create` - Creates a repository on Gitlab
* `autolab git delete` - Deletes the specified repository from Gitlab
* `autolab git push` - Adds, commits, pushes the code
* `autolab prefs changeserver` - To change the host of the gitlab server
* `autolab prefs changelang` - To change the language of the code submission
* `autolab submit` -  To submit the code to JavaAutolab and fetch the results
* `autolab help` - Print help manual

Check [Assignment Submission Instructions](https://github.com/AutolabJS/autolabcli/wiki/Assignment-Submission-using-autolab-CLI) for the sequence of commands.

## Installation ##
```
npm install -g @autolabjs/autolabcli
```

## License ##
GNU General Public License

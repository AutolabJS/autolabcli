# AutoLab CLI #

[![Code Climate](https://codeclimate.com/github/prasadtalasila/autolabcli/badges/gpa.svg)](https://codeclimate.com/github/prasadtalasila/autolabcli) [![Known Vulnerabilities](https://snyk.io/test/github/autolabjs/autolabcli/badge.svg)](https://snyk.io/test/github/autolabjs/autolabcli) [![Build Status](https://travis-ci.org/AutolabJS/autolabcli.svg?branch=master)](https://travis-ci.org/AutolabJS/autolabcli)    

A client command line interface for submissions to [AutolabJS](https://github.com/AutolabJS/AutolabJS).



## Commands ##
* `autolab init` - Initializes local repository and authenticates
* `autolab exit` - Wipes off the credentials from the system
* `autolab git create` - Creates a repository on Gitlab
* `autolab git delete` - Deletes the specified repository from Gitlab
* `autolab git changeserver` - To change the host of the gitlab server
* `autolab git changelang` - To change the language of the code submission
* `autolab git push` - Adds, commits, pushes the code
* `autolab submit` -  To submit the code to JavaAutolab and fetch the results
* `autolab exit` - Print help manual


## Installation ##
```
npm install -g autolabcli
```

## Screenshot ##
![autolab-screenshot](https://cloud.githubusercontent.com/assets/13795788/21156451/e1d7cf04-c19b-11e6-9174-593ab68be76a.png)

## License ##
GNU General Public License

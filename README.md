# autolabcli
Codebase for backward incompatible revision of autolabcli v0.1.1.

[![codecov](https://codecov.io/gh/AutolabJS/autolabcli/branch/autolabcli-ng/graph/badge.svg)](https://codecov.io/gh/AutolabJS/autolabcli)
[![Code Climate](https://codeclimate.com/github/AutolabJS/autolabcli/badges/gpa.svg)](https://codeclimate.com/github/AutolabJS/autolabcli)

A client command line interface for submissions to [AutolabJS](https://github.com/AutolabJS/AutolabJS).

## Commands ##
* `autolabjs init [-u <username> -p <password>]` - Log into AutolabJS.
* `autolabjs exit` - Logout off AutolabJS
* `autolabjs prefs changeserver [ --type ms --host <host> --port <port>]` - To change the host for main server.
* `autolabjs prefs changeserver [ --type gitlab --host <host>]` - To change the host for gitlab server.
* `autolabjs prefs show` - Show the saved preferences
* `autolabjs eval [-l <lab_name> --lang <language>]` - To submit your code for evaluation
* `autolabjs help` - Print help manual

## License ##
GNU General Public License

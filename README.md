#AutoLab CLI
A client command line interface for submissions to [JavaAutolab](https://github.com/prasadtalasila/JavaAutolab).
##Commands
* `autolab init` - Initializes local repository and authenticates
* `autolab exit` - Wipes off the credentials from the system
* `autolab git create` - Creates a repository on Gitlab
* `autolab git delete` - Deletes the specified repository from Gitlab
* `autolab git changeserver` - To change the host of the gitlab server
* `autolab git push` - Adds, commits, pushes the code
* `autolab submit` -  To submit the code to JavaAutolab and fetch the results
* `autolab exit` - Print help manual


##Installation
```
$ git clone https://github.com/prasadtalasila/autolabcli
$ cd autolabcli
```

###Normal Installation
Install autolab and its dependencies
 ```
$ npm install -g --production
 ```
###Development Installation
Install:
```
$ npm install
$ npm install grunt-cli -g
```
Test:
```
$ grunt test
```

Replace `autolab` with `node index.js` when running commands.

##Screenshot
![autolab-screenshot](https://cloud.githubusercontent.com/assets/13795788/21156451/e1d7cf04-c19b-11e6-9174-593ab68be76a.png)

##License
GNU General Public License
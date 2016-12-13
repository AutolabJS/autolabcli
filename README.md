#AutoLab CLI
A client command line interface for submissions to [JavaAutolab](https://github.com/prasadtalasila/JavaAutolab).
##Commands
* `autolab init` - Takes the credentials.
* `autolab exit` - Wipes off the credentials. Will have to do an init again, to work with autolab.
* `autolab git create` - Creates a repository on gitlab
* `autolab git delete` - Deletes the specified repository
* `autolab git changeserver` - To change the host of the gitlab server
* `autolab push` - Adds, commits, pushes the code
* `autolab submit` -  To submit the code to JavaAutolab and fetch the results


##Installation
```
$ git clone https://github.com/prasadtalasila/autolabcli
$ cd autolabcli
```

Install autolab and its dependencies
 ```
$ npm install -g
 ```

##Screenshot
![autolab-screenshot](https://cloud.githubusercontent.com/assets/13795788/21156451/e1d7cf04-c19b-11e6-9174-593ab68be76a.png)

##License
GNU General Public License
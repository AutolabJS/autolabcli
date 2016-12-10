#AutoLab CLI
A client command line interface for submissions to [JavaAutolab](https://github.com/prasadtalasila/JavaAutolab).
##Commands
* `autolab init` - Takes the credentials.
* `autolab exit` - Wipes off the credentials. Will have to do an init again, to work with autolab.
* `autolab git create` - Creates a repository on gitlab
* `autolab git delete` - Deletes the specified repository
* `autolab git changeserver` - To change the host of the gitlab server
* `autolab push` - Adds, commits, pushes the code

Still coming

* `autolab submit` -  To submit the code to JavaAutolab
* `autolab result` - To fetch the results

##Installation
```
$ git clone https://github.com/prasadtalasila/autolabcli
$ cd autolabcli
```

Install all dependencies
 ```
$ npm install -g
 ```

##Screenshot
<img width="733" alt="screen shot 2016-12-08 at 7 13 51 pm" src="https://cloud.githubusercontent.com/assets/13795788/21012233/06f8b4da-bd7b-11e6-93b1-7ad78357803c.png">

##License
GNU General Public License
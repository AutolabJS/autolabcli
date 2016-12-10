#AutoLab CLI
A client command line interface for submissions to [JavaAutolab](https://github.com/prasadtalasila/JavaAutolab).
##Commands
* `autograder init` - Takes the credentials.
* `autograder exit` - Wipes off the credentials. Will have to do an init again, to work with autograder.
* `autograder online create` - Creates a repository on gitlab
* `autograder online delete` - Deletes the specified repository
* `autograder online changehost` - To change the host of the gitlab server
* `autograder push` - Adds, commits, pushes the code

Still coming

* `autograder submit` -  To submit the code to JavaAutolab
* `autograder result` - To fetch the results

##Installation
```
$ git clone https://github.com/SebastinSanty/autograder-cli
$ cd autograder-cli
```

Install all dependencies
 ```
$ npm install -g
 ```
Also a gitlab application should be running on localhost:80 (use docker)

##Screenshot
<img width="733" alt="screen shot 2016-12-08 at 7 13 51 pm" src="https://cloud.githubusercontent.com/assets/13795788/21012233/06f8b4da-bd7b-11e6-93b1-7ad78357803c.png">

##License
GNU General Public License
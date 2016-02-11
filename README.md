bonesApp Base using [Ionic](http://ionicframework.com) & [Browserify](http://browserify.org/)
=====================

## Using this project

Requirements:
[Node.js](https://nodejs.org/en/)

###Setup:

1. Install [Ionic](http://ionicframework.com) with the following command on your cli:

        $ npm install -g cordova ionic

2. Install the node modules

        $ cd bonesApp

        $ npm install

3. Have Ionic serve the app (--nobrowser since browser-sync creates a better tab for development with fast live reloading. Without this flag 2 tabs will be made.)

        $ gulp browserifyInit (since dist no longer exists by default. You can skip this and reload the page once ionic serve's browserify command finishes instead if you prefer)

        $ ionic serve --nobrowser

More info on this can be found on the Ionic [Getting Started](http://ionicframework.com/getting-started) page and the [Ionic CLI](https://github.com/driftyco/ionic-cli) repo.


### Testing

This project uses karma with jasmine for unit testing, and maintains coverage reports using Karma-coverage(Istanbul).

In order to run the tests run:

```
$ gulp test
```

This will begin the test task which will run the tests, then continue to watch for any changes on tested files. Once the tests run once a coverage/ directory will be created containing a visual code coverage report you can view by opening Index.html.




## Issues
Go ahead and make an issue on this repo or contact jmalmste.

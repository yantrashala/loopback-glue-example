'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
var glue = require('loopback-glue');

var app = module.exports = loopback();

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

var child1app = require('../subapps/child1app/server/server');
var child2app = require('../subapps/child2app/server/server');

var options = {
  "appRootDir": __dirname,
  "subapps": [{
    "name": "child1app",
    "app" : child1app,
    "mountPath" : "/child1"
  },
  {
    "name": "child2app",
    "app" : child2app,
    "mountPath" : "/child2"
  }]
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
glue(app, options, function(err) {
  if (err) throw err;

  console.log(app._router);

  // start the server if `$ node server.js`
  if (require.main === module)
  app.start();
});

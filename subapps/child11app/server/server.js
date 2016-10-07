var loopback = require('loopback');
var boot = require('loopback-boot');

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

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.

app.boot = function(config, cb) {
  config = config || {};
  config.appRootDir = config.appRootDir || __dirname;
  boot(app, config, function(err) {
    if (err) throw err;
    cb();
  })
}

if (require.main == module) {
  app.boot(function() {
    app.start();
  })
}

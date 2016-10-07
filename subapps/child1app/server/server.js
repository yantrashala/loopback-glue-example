var loopback = require('loopback');
var boot = require('loopback-boot');
var app = module.exports = loopback();
var async = require('async');
var childConfigurations = require('./child-configurations');
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
bootChildApps(childConfigurations, function() {
  boot(app, __dirname, function(err) {
    if (err) throw err;

    // start the server if `$ node server.js`
    if (require.main === module)
      app.start();
  });
})

function bootChildApps(childConfigurations, cb) {
  async.eachSeries(childConfigurations, function iteratee(item, callback) {
    app[item.name] = require(item.appRootDir);
    app[item.name].boot({config: item}, callback);
  }, function done() {
    cb();
  });
}

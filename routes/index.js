'use strict';

module.exports = function(app, client, isLoggedIn) {
  var fit = require('../lib/fit');

  app.get('/', function(req, res) {
    res.render('index', {
      pageType: 'index',
      session: req.session
    });
  });

  app.post('/activity', function(req, res) {
    fit.addActivity(req, client, function(err, activity) {

    });
  });

  app.post('/data_point', function(req, res) {
    fit.addDataPoint(req, client, function(err, dataPoint) {

    });
  });

  // Logout
  app.post('/logout', isLoggedIn, function(req, res) {
    req.session.reset();
    res.json({
      'status': 'okay'
    });
  });
};

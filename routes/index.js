'use strict';

module.exports = function(app, client, isLoggedIn) {
  var activity = require('../lib/activity');
  var point = require('../lib/point');
  var import_ = require('../lib/import');

  app.get('/', function(req, res) {
    res.render('index', {
      pageType: 'index',
      session: req.session
    });
  });

  app.get('/activities', function(req, res) {
    activity.getActivities(req.session.email, client, function(err, activities) {
      res.render('activities', {
        pageType: 'index',
        session: req.session,
        activities: activities
      });
    });
  });

  app.get('/activity/:id', function(req, res) {
    activity.getActivity('activity:' + req.params.id, client, function(err, activity_) {
      point.getPoints(req.params.id, client, function(err, points) {
        activity.getActivityStats(req.params.id, client, function(err, stats) {
          res.render('activity', {
            pageType: 'index',
            session: req.session,
            activity: activity_,
            points: points,
            stats: stats
          });
        });
      });
    });
  });

  app.post('/activity', function(req, res) {
    activity.addActivity(req, client, function(err, activity) {
      res.render('activity', {
        pageType: 'index',
        session: req.session,
        activity: activity
      });
    });
  });

  app.post('/data_point', function(req, res) {
    point.addPoint(req, client, function(err, dataPoint) {

    });
  });

  app.get('/import', function(req, res) {
    res.render('import', {
      pageType: 'index',
      session: req.session
    });
  });

  app.post('/import', function(req, res) {    
    import_.importGpx(req, client, function(err, activityKey) {
      res.redirect('/activities');
    });
  });
};

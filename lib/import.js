'use strict';

var fs = require('fs');
var xml2js = require('xml2js');
var activity = require('./activity');
var point = require('./point');

exports.importGpx = function(req, client, callback) {
  var parser = new xml2js.Parser();

  fs.readFile(req.files.file.path, function (err, data) {
    parser.parseString(data, function (err, result) {
      var trk = result.gpx.trk[0];
      var activityName = trk.name;
      var activityId;
      var points = trk.trkseg[0].trkpt;

      // Create the activity
      activity.addActivity({
        'name': activityName,
        'email': req.session.email,
        'time': points[0].time
      }, client, function(err, activity) {
        if (err) {
          callback(err);
        } else {
          activityId = activity.id;

          // Add the points
          points.forEach(function(point_, idx) {
            point.addPoint(activityId, {
              'time': point_.time[0],
              'lat': point_.$.lat,
              'lon': point_.$.lon,
              'ele': point_.ele
            }, client);
          });

          callback(null, activity);
        }
      });
    });
  });
};

'use strict';

var point = require('./point');

exports.addActivity = function(activity, client, callback) {
  client.incr('activity:id', function(err, val) {
    if (err) {
      callback(err)
    } else {
      var activityKey = 'activity:' + val;
      activity['id'] = val;
      client.hmset(activityKey, activity);
      client.rpush('activities:' + activity.email, activityKey);
      callback(null, activity);
    }
  });
};

exports.getActivity = function(key, client, callback) {
  client.hgetall(key, callback);
};

exports.getActivities = function(email, client, callback) {
  var self = this;
  client.lrange('activities:' + email, 0, -1, function(err, activityKeys) {
    var activities = [];
    var keyCount = activityKeys.length;
    var activityCount = 0;

    if (err) {
      callback(err);
    } else if (keyCount > 0) {
      activityKeys.forEach(function(key, idx) {
        self.getActivity(key, client, function(err, activity) {
          activities[idx] = activity;
          if (++activityCount === keyCount) {
            callback(null, activities);
          } 
        });
      });
    } else {
      callback(null, activities);
    }
  });
};

exports.getActivityStats = function(activityId, client, callback) {
  point.getPoints(activityId, client, function(err, points) {
    if (err) {
      callback(err);
    } else {
      var distance = 0;
      var time;

      for (var i = 1, l = points.length; i < l; i++) {
        distance += point.distanceBetween(points[i - 1], points[i]);
      }

      time = (new Date(points[points.length - 1].time).getTime() -
              new Date(points[0].time).getTime()) / 1000 / 60 / 60;
      callback(null, {
        distance: distance / 1000,
        time: time,
        averageSpeed: distance / time / 1000
      });
    }
  });
};

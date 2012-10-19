'use strict';

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

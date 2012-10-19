'use strict';

exports.addPoint = function(activityId, point, client, callback) {
  var key = 'point:' + activityId + ':' + new Date(point.time).getTime();
  client.hmset(key, point);
  client.rpush('points:' + activityId, key);
  if (callback) {
    callback(null, key);
  }
};

exports.getPoint = function(key, client, callback) {
  client.hgetall(key, callback);
};

exports.getPoints = function(activityId, client, callback) {
  var self = this;
  client.lrange('points:' + activityId, 0, -1, function(err, pointKeys) {
    var points = [];
    var keyCount = pointKeys.length;
    var pointCount = 0;

    if (err) {
      callback(err);
    } else if (keyCount > 0) {
      pointKeys.forEach(function(key, idx) {
        self.getPoint(key, client, function(err, point) {
          points[idx] = point;
          if (++pointCount === keyCount) {
            callback(null, points);
          } 
        });
      });
    } else {
      callback(null, points);
    }
  });
};

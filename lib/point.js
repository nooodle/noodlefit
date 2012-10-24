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

var EARTH_RADIUS = 6378000;  // meters

function toRadians(degrees) {
  return degrees * 3.1415926 / 180;
}

exports.distanceBetween = function(point1, point2) {
  // Since our points should be close to one another, we use the cheaper
  // Pythagoras’ theorem on an equirectangular projection.
  var lat1 = toRadians(point1.lat);
  var lat2 = toRadians(point2.lat);
  var lon1 = toRadians(point1.lon);
  var lon2 = toRadians(point2.lon);
  var x = (lon2 - lon1) * Math.cos((lat1 + lat2)/2);
  var y = lat2 - lat1;
  return Math.sqrt(x * x + y * y) * EARTH_RADIUS;
};

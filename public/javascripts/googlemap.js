'use strict';

define(['jquery'],
  function($) {

  var line;
  var pointItems = document.getElementsByClassName('point');

  var addNewPoint = function(e) {
    var path = line.getPath();
    path.push(e.latLng);
  };

  var self = {
    drawMap: function() {
      var mapDiv = document.getElementById('map-canvas');
      var map = new google.maps.Map(mapDiv, {
        center: new google.maps.LatLng(pointItems[0].getAttribute('data-lat'), pointItems[pointItems.length - 1].getAttribute('data-lon')),
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });
      var path = [];

      for (var i = 0; i < pointItems.length; i ++) {
        path.push(new google.maps.LatLng(pointItems[i].getAttribute('data-lat'), pointItems[i].getAttribute('data-lon')))
      }

      line = new google.maps.Polyline({
        path: path,
        strokeColor: '#f01347',
        strokeOpacity: 0.9,
        strokeWeight: 3
      });

      line.setMap(map);
    }
  };

  return self;
});

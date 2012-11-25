'use strict';

requirejs.config({
  baseUrl: '/javascripts',
  enforceDefine: true,
  paths: {
    jquery: '/javascripts/jquery'
  }
});

define(['jquery', 'googlemap'],
  function($, googlemap) {

  var body = $('body');
  var header = $('header');

  body.on('click', '#login', function(ev) {
    ev.preventDefault();

    navigator.id.get(function(assertion) {
      if (!assertion) {
        return;
      }

      $.ajax({
        url: '/persona/verify',
        type: 'POST',
        data: { assertion: assertion },
        dataType: 'json',
        cache: false
      }).done(function(data) {
        if (data.status === 'okay') {
          document.location.href = '/';
        } else {
          console.log('Login failed because ' + data.reason);
        }
      });
    });
  });

  body.on('click', '#logout', function(ev) {
    ev.preventDefault();

    $.ajax({
      url: '/persona/logout',
      type: 'POST',
      dataType: 'json',
      cache: false
    }).done(function() {
      document.location.href = '/';
    });
  });

  if ($('#map-canvas')) {
    googlemap.drawMap();
  }

  // Overrides the zindex of the map
  header.css({ 'zIndex': 5 });
});

'use strict';

requirejs.config({
  baseUrl: '/javascripts',
  enforceDefine: true,
  paths: {
    jquery: '/javascripts/jquery'
  }
});

define(['jquery'],
  function($) {

  var body = $('body');

  body.on('click', '#login', function(ev) {
    ev.preventDefault();
    navigator.id.get(function(assertion) {
      if (!assertion) {
        return;
      }

      var xhr = new XMLHttpRequest();

      xhr.open("POST", "/persona/verify", true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.addEventListener("loadend", function(e) {
        try {
          var data = JSON.parse(this.response);
          if (data.status === "okay") {
            document.location.href = '/';
          } else {
            console.log('Login failed because ' + data.reason);
          }
        } catch (ex) {
          console.log('Invalid JSON received');
        }
      }, false);

      xhr.send(JSON.stringify({
        assertion: assertion
      }));
    });
  });
});

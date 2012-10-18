'use strict';

module.exports = function(app, client, isLoggedIn) {
  app.get('/', function(req, res) {
    res.render('index', {
      pageType: 'index',
      session: req.session
    });
  });
};

var express = require('express');
var router = express.Router();
var passport = require('passport');
var dotenv = require('dotenv');
var util = require('util');
var url = require('url');
var querystring = require('querystring');

dotenv.config();


// This is a simple login GET route, which reidrects after the callback
router.get('/login', passport.authenticate('auth0', {
  // Define the scope for passport
  scope: 'openid email profile'
}), function (req, res) {
  // Redirect
  res.redirect('/');
});

// The last step for auth/redirection
router.get('/callback', function (req, res, next) {
  // Redirect if !user
  passport.authenticate('auth0', function (err, user, info) {
    if (err) { return next(err); }
    //if (!user) { return res.redirect('/'); }
    if (!user) {res.render("failure", {error: "Unauthorized User"})}
    // Redirect if user
    req.logIn(user, function (err) {
      if (err) { return next(err); }
      const returnTo = req.session.returnTo;
      delete req.session.returnTo;
      res.redirect(returnTo || '/user');
    });
  })(req, res, next);
});

// Perform session logout and redirect to homepage
router.get('/logout', (req, res) => {
  req.logout();

  // Used from an older express, connection no longer needed
  // https://www.geeksforgeeks.org/express-js-req-protocol-property/
  var returnTo = req.protocol + '://' + req.hostname;
  var port = req.connection.localPort;
  if (port !== undefined && port !== 80 && port !== 443) {
    returnTo += ':' + port;
  }
  // https://www.geeksforgeeks.org/node-js-util-format-method/
  var logoutURL = new url.URL(
    util.format('https://%s/logout', process.env.AUTH0_DOMAIN)
  );
  // returnTu var stated above ()
  var searchString = querystring.stringify({
    client_id: process.env.AUTH0_CLIENT_ID,
    returnTo: returnTo
  });
  logoutURL.search = searchString;

  // The actual redirect after logout is completed
  res.redirect(logoutURL);
});

module.exports = router;

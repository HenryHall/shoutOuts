var express = require('express');
var passport = require('passport');
var path = require('path');
var router = express.Router();

router.post('/', function(req, res, next) {
  console.log("In loginRoute.js");
  passport.authenticate('local', function(err, user, info) {
    if (err) { console.log('In err'); return next(err); }
    if (!user) { console.log('False credentials'); return next(err); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      console.log('success');
      // res.redirect('/submit');
      // res.sendFile( path.resolve( 'public/views/submit.html' ) );
      res.send(req.user)
    });
  })(req, res, next);
});


module.exports = router;

var express = require('express');
var passport = require('passport');
var path = require('path');
var router = express.Router();

router.post('/',
  passport.authenticate('local'), function(req, res){
    console.log("Here");
  res.redirect('/users/' + user.username);
});

// router.post('/', function(req, res, next) {
//   passport.authenticate('local', function(err, user, info) {
//     if (err) { console.log('In err'); return next(err); }
//     if (!user) { console.log('False credentials'); return next(err); }
//     req.logIn(user, function(err) {
//       if (err) { return next(err); }
//       console.log('success');
//       return res.redirect('/users/' + user.username);
//     });
//   })(req, res, next);
// });



module.exports = router;

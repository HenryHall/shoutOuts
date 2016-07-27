var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var encryptLib = require('../modules/encryption');
var connection = require('../modules/connection');
var pg = require('pg');

//serialize user
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, passDone) {
  console.log('called deserializeUser');

  pg.connect(connection, function(err, client, pgDone) {
    //connection error
    if(err){
      console.log(err);
      res.sendStatus(500);
    }

    client.query("SELECT * FROM users WHERE id = $1", [id], function(err, results) {
      pgDone();

      if(results.rows.length >= 1){
        console.log(results.rows[0]);
        return passDone(null, results.rows[0]);
      }

      // handle errors
      if(err){
        console.log(err);
      }

    });
  });
});

// Does actual work of logging in
passport.use('local', new localStrategy({
    passReqToCallback: true,
    usernameField: 'username'
    }, function(req, username, password, done){
      console.log("In Strat");
	    pg.connect(connection, function (err, client) {
	    	console.log('called local - pg');
	    	var user = {};
        var query = client.query("SELECT * FROM users WHERE username = $1", [username]);

        query.on('row', function (row) {
        	console.log('User obj', row);
        	user = row;

          // Hash and compare
          if(encryptLib.comparePassword(password, user.password)) {
            // all good!
            console.log('pass matched');
            done(null, user);
          } else {
            console.log('pass dont match');
            done(null, false, {message: 'Incorrect credentials.'});
          }

        });

        // After all data is returned, close connection and return results
        query.on('end', function () {
            client.end();
        });

        // Handle Errors
        if (err) {
            console.log(err);
        }
	    });
    }
));

module.exports = passport;

var pg = require('pg');
var connection = require('../modules/connection');


module.exports = function(token, callback){
  var user = {};
  console.log("Verifying user token:", token);
  pg.connect(connection, function (err, client, done) {

      //Verify token.
      var verQuery = client.query('SELECT id, name, completed, score FROM users WHERE token = ($1)', [token]);

      verQuery.on('row', function(row){
        user.id = row.id
        user.username = row.name;
        user.completed = row.completed;
        user.score = row.score;
        user.token = token;
      });

      verQuery.on('end', function(){
        done();

        if (user.username == undefined){
          console.log("Verification failed, invalid token.");
          return callback(undefined);
        } else {
          console.log("Verified:", user);
          return callback(user);
        }

      });


  });

};


var express = require('express');
var router = express.Router();
var pg = require('pg');
var connection = require('../modules/connection');

router.post('/', function(req,res){
  console.log('In /peerAssign with:', req.body);


  pg.connect(connection, function (err, client, done) {
    var token = req.body.token;
    var username = undefined;
    var completed = 0;
    var classList = [];

    verifyUser(token);

    function verifyUser(newToken){

      //Verify token.
      var verQuery = client.query('SELECT name, completed, score FROM users WHERE token = ($1)', [newToken]);

      verQuery.on('row', function(row){
        username = row.name;
        completed = row.completed;
        score = row.score;
      });

      verQuery.on('end', function(){
        if (username == undefined){
          console.log("Verification failed, invalid token.");
          done();
          res.sendStatus(401);
          return;
        } else if (completed == 1){
          console.log(username, "has already completed the quiz.", completed);
          done();
          res.send({completed: true, score: score});
          return;
        } else {
          console.log(username, "accessing page.");
          getData(newToken);
        }
      });

    };

    function getData(newToken){

      var results = [];
      var query = client.query('SELECT id, name, question, imglink FROM users WHERE token != ($1)', [newToken]);

      query.on('row', function(row){
        classList.push(row.name);
        //DO NOT SEND THIS IN THE RETURN OBJECT
        delete row.name;
        results.push(row);
      });

      query.on('end', function(){

        done();

        // Shuffle questions to thwart cheaters
        var currentIndex = results.length, temporaryValue, randomIndex;

        while (0 !== currentIndex) {

          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;

          // And swap it with the current element.
          temporaryValue = results[currentIndex];
          results[currentIndex] = results[randomIndex];
          results[randomIndex] = temporaryValue;
        }

        res.send({username: username, classList: classList, results: results});

      });

    };


  });


});

module.exports = router;

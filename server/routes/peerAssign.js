
var express = require('express');
var router = express.Router();
var pg = require('pg');
var connection = require('../modules/connection');

router.get('/', function(req,res){
  console.log('In /peerAssign');

  //Validate
  var user = req.session.user;
  if (!user){res.sendStatus(403);};

  pg.connect(connection, function (err, client, done) {
    var classList = [];
    var questions = [];

    var query = client.query('SELECT id, name FROM users');

    query.on('row', function(row){
      classList.push(row);
    });

    query.on('end', function(){

      var questionQuery = client.query('SELECT triviaid, question FROM trivia WHERE id != ($1)', [user.id]);

      questionQuery.on('row', function(row){
        questions.push(row);
      });

      questionQuery.on('end', function(){

        // Shuffle questions to thwart cheaters
        var currentIndex = questions.length, temporaryValue, randomIndex;

        while (0 !== currentIndex) {

          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;

          // And swap it with the current element.
          temporaryValue = questions[currentIndex];
          questions[currentIndex] = questions[randomIndex];
          questions[randomIndex] = temporaryValue;
        }

        done();
        res.send({user: user, classList: classList, questions: questions});

      });



    });


  });


});

module.exports = router;

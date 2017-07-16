
var express = require('express');
var router = express.Router();
var pg = require('pg');
var connection = require('../modules/connection');

router.put('/', function(req, res){
  console.log("In /submitAnswer with:", req.body);

  var answer = req.body.answer;
  var questionId = req.body.questionId;

  //Validate
  var user = req.session.user;
  //I'll just leave this out for people to have fun with
  // if (!user || user.completed == true){res.sendStatus(403);};
  if (!user){res.sendStatus(403);};

  pg.connect(connection, function(err, client, done){

    var query = client.query('SELECT answer FROM trivia WHERE triviaid = ($1)', [questionId]);

    query.on('row', function(row){
      if (row.answer == answer){
        client.query('UPDATE users SET score = score + 1 WHERE token = ($1)', [user.token]);
        res.send({outcome: true});
      } else {
        res.send({outcome: false});
      }
    });

    done();

  });

});


module.exports = router;

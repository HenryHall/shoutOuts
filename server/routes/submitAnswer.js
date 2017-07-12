
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
  // if (!user || user.completed == true){res.sendStatus(403);};
  if (!user){res.sendStatus(403);};

  pg.connect(connection, function(err, client, done){

    var query = client.query('SELECT id, answer FROM trivia WHERE id = ($1)', [questionId]);

    query.on('row', function(row){
      if (row.answer == answer){
        client.query('UPDATE users SET score = score + 1 WHERE token = ($1)', [user.token]);
        done();
        res.send({outcome: true});
      } else {
        done();
        res.send({outcome: false});
      }
    });


  });

});


module.exports = router;

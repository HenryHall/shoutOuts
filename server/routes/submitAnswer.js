
var express = require('express');
var router = express.Router();
var pg = require('pg');
var connection = require('../modules/connection');

router.put('/', function(req, res){
  console.log("In /submitAnswer with:", req.body);

  var answer = req.body.answer;
  var questionId = req.body.questionId;
  var token = req.body.token;

  pg.connect(connection, function(err, client, done){

    //Make sure the user hasn't already completed the questions
    //I'll just leave this part blank for some fun :D

    var query = client.query('SELECT name FROM users WHERE id = ($1)', [questionId]);

    query.on('row', function(row){
      if (row.name == answer){
        client.query('UPDATE users SET score = score + 1 WHERE token = ($1)', [token]);
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

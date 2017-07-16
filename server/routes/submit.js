var express = require('express');
var router = express.Router();
var pg = require('pg');
var connection = require('../modules/connection');

router.post('/memory', function(req, res){

  console.log("In submit/memory with:", req.body);

  //Validate
  var user = req.session.user;
  if (!user){res.sendStatus(403);};

  pg.connect(connection, function(err, client, done){

    client.query('INSERT INTO memories(id, memory) VALUES ($1, $2)', [user.id, req.body.memory])
    .then(function(){
      res.sendStatus(200);
    }, function(err){
      console.log("Invalid id, I'm a teapot.");
      res.sendStatus(418);
    });

    done();

  });

});


router.post('/trivia', function(req, res){

  console.log("In submit/trivia with:", req.body);

  //Validate
  var user = req.session.user;
  if (!user){res.sendStatus(403);};

  pg.connect(connection, function(err, client, done){

    client.query('INSERT INTO trivia(id, question, answer, submittedby) VALUES ($1, $2, $3, $4)', [req.body.classmate.id, req.body.question, req.body.classmate.name, user.id])
    .then(function(){
      res.sendStatus(200);
    }, function(err){
      console.log("Invalid something, I'm a teapot.");
      res.sendStatus(418);
    });

    done();

  });

});


module.exports = router;

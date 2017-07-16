var express = require('express');
var router = express.Router();
var pg = require('pg');
var connection = require('../modules/connection');

router.put('/finished', function(req, res){
  console.log("In complete/finished");

  //Validate
  var user = req.session.user;
  if (!user){res.sendStatus(403);};

  pg.connect(connection, function(err, client, done){
    client.query('UPDATE users SET completed = TRUE WHERE token = ($1)', [user.token]);
    done();
    res.sendStatus(200);
  });

});


router.put('/playAgain', function(req, res){
  console.log("In complete/playAgain");

  //Validate
  var user = req.session.user;
  if (!user){res.sendStatus(403);};

  pg.connect(connection, function(err, client, done){
    client.query('UPDATE users SET completed = FALSE, score = 0 WHERE token = ($1)', [user.token]);
    done();
    res.sendStatus(200);
  });
});


module.exports = router;

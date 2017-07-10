var express = require('express');
var router = express.Router();
var pg = require('pg');
var connection = require('../modules/connection');

router.put('/', function(req, res){

  console.log("In submitMemory with:", req.body);

  pg.connect(connection, function(err, client, done){

    client.query('UPDATE users SET memory = ($1) WHERE token = ($2)', [req.body.memory, req.body.token])
    .then(function(){
      done();
      res.sendStatus(200);
    }, function(err){
      console.log("Invalid token, I'm a teapot.");
      done();
      res.sendStatus(418);
    });

  });

});


module.exports = router;

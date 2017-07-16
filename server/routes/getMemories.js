var express = require('express');
var router = express.Router();
var pg = require('pg');
var connection = require('../modules/connection');

router.get('/', function(req, res){

  console.log("In /getMemories");

  //Validate
  var user = req.session.user;
  if (!user){res.sendStatus(403);};

  pg.connect(connection, function(err, client, done){

    var results = [];
    var query = client.query('SELECT id, memory FROM memories');

    query.on('row', function(row){
      results.push(row);
    });

    query.on('end', function(){

      done();
      res.send(results);

    });

  });

});


module.exports = router;

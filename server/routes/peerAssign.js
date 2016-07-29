
var express = require('express');
var path = require('path');
var router = express.Router();
var pg = require('pg');
var connection = require('../modules/connection');

router.get('/', function(req,res){
  console.log('In /submit');

  function ensureAuthenticated(req, res, next){
    if (req.isAuthenticated()){
      return next();
    } else {
      res.redirect('/loginRoute');
    }
  }

  pg.connect(connection, function (err, client, done) {

    var results = [];

    var query = client.query("SELECT users WHERE username = ($1)", [req.body.username]);

    query.on('row', function(row){
      results.push(row);
    });

    query.on('end', function(){

      console.log(results);

      res.send(results.peer);


    });


  });




});

module.exports = router;

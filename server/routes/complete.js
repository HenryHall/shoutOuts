var express = require('express');
var router = express.Router();
var pg = require('pg');
var connection = require('../modules/connection');

router.put('/', function(req, res){

  pg.connect(connection, function(err, client, done){
    client.query('UPDATE users SET completed = TRUE WHERE token = ($1)', [req.body.token]);
    done();
    res.sendStatus(200);
  });

});


module.exports = router;

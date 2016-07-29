
var express = require('express');
var path = require('path');
var router = express.Router();

router.get('/', function(req,res){
  console.log('In /submit');
  // res.sendFile( path.resolve( 'public/views/submit.html' ) );
  // res.send('./views/submit.html');
  res.send(req.user);
});

module.exports = router;

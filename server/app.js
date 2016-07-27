var express=require('express');
var app=express();
var path=require('path');


var passport = require('../server/strategies/userStrategy.js');
var session = require('express-session');

app.set('port', process.env.PORT || 2016);
app.use( express.static( 'public' ) );

app.listen(app.get('port'), function() {
  console.log('Good Morning', app.get('port'));
});

app.get( '/', function( req, res ){
  console.log( 'Mayo' );
  res.sendFile( path.resolve( 'public/views/index.html' ) );
}); // end base url

var express=require('express');
var app=express();
var path=require('path');
var bodyParser=require('body-parser');
var urlencodedParser=bodyParser.urlencoded( { extended: false } );
app.use( bodyParser.json() );


app.set('port', process.env.PORT || 2016);
app.use( express.static( 'public' ) );


app.listen(app.get('port'), function() {
  console.log('Good Morning', app.get('port'));
});


app.get( '/', function( req, res ){
  console.log( 'Mayo' );
  res.sendFile( path.resolve( 'public/views/login.html' ) );
}); // end base url


var peerAssign = require('../server/routes/peerAssign');
var submitAnswer = require('../server/routes/submitAnswer');
var complete = require('../server/routes/complete');
var submitMemory = require('../server/routes/submitMemory');


//Routes
app.use('/getData', peerAssign);
app.use('/submitAnswer', submitAnswer);
app.use('/complete', complete);
app.use('/submitMemory', submitMemory);

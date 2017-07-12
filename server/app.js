var express=require('express');
var session = require('express-session');
var app=express();
var path=require('path');
var bodyParser=require('body-parser');
var verification = require('./modules/verify.js');
var urlencodedParser=bodyParser.urlencoded( { extended: false } );
app.use( bodyParser.json() );
app.use(session({secret: 'mayo'}));


app.set('port', process.env.PORT || 2016);
app.use( express.static( 'public' ) );


app.listen(app.get('port'), function() {
  console.log('Good Morning', app.get('port'));
});


app.get( '/', function( req, res ){
  console.log( 'Mayo' );

  verification(req.param('token'), function(newUser){
    req.session.user = newUser;

    if (req.session.user){
      // if (req.session.user.completed){
      // Completed user, send them to memory and trivia submission
        // res.sendFile( path.resolve( '' ))
      // } else {
        res.sendFile( path.resolve( 'public/views/login.html' ) );
      // }
    } else {
      res.sendStatus(403);
    }

  });


}); // end base url


var peerAssign = require('../server/routes/peerAssign');
var submitAnswer = require('../server/routes/submitAnswer');
var complete = require('../server/routes/complete');
var submit = require('../server/routes/submit');


//Routes
app.use('/getData', peerAssign);
app.use('/submitAnswer', submitAnswer);
app.use('/complete', complete);
app.use('/submit', submit);

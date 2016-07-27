var express=require('express');
var app=express();
var path=require('path');
var bodyParser=require('body-parser');
var urlencodedParser=bodyParser.urlencoded( { extended: false } );


var passport = require('../server/strategies/userStrategy.js');
var session = require('express-session');

app.set('port', process.env.PORT || 2016);
app.use( express.static( 'public' ) );

app.listen(app.get('port'), function() {
  console.log('Good Morning', app.get('port'));
});

// Passport Session Configuration //
app.use(session({
   secret: 'secret',
   key: 'user',
   resave: 'true',
   saveUninitialized: false,
   cookie: {maxage: 60000, secure: false}
}));

// init passport
app.use(passport.initialize());
app.use(passport.session());

app.get( '/', function( req, res ){
  console.log( 'Mayo' );
  res.sendFile( path.resolve( 'public/views/login.html' ) );
}); // end base url


var loginRoute = require('../server/routes/loginRoute');


//Routes
app.use('/loginRoute', loginRoute);

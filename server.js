require('dotenv').config();
var favicon = require('serve-favicon');
const chalk = require('chalk');
var express = require("express");
var fs = require('fs');
var path = require('path');
var app     = express();
var bodyParser = require('body-parser');
var https = require('https');
var multer  = require('multer');

const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./app/config/database');

const host =process.env.HOST || 'http://localhost:';
const port = process.env.PORT || 3000;

// Set up mongoose connection
const mongoose = require('mongoose');
let mongoDB = config.database;
mongoose.connect(mongoDB, { useNewUrlParser: true })
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies



//redirect static files 
app.use(favicon(__dirname + '/app/assets/favicon.ico'));

app.use('/static',express.static(__dirname + '/app/scripts'));
app.use('/assets',express.static(__dirname + '/app/assets'));


// Express Session Middleware
app.use(session({
  secret: 'keyboard cat test',
  resave: true,
  saveUninitialized: true
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));


// Passport Config
require('./app/config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});
app.set('views', path.join(__dirname, './app/views'));
app.set('view engine', 'ejs');

// Imports routes 
const main = require('./app/routes/home');  
const users = require('./app/routes/users');
const errors = require('./app/routes/errors'); 

app.use('/', main);
app.use('/users', users);
app.use('/error', errors);


// Handle 404
app.use(function(req, res) {
  res.status(404);
  res.redirect(req.baseUrl + '/error/404');
});

// Handle 401
app.use(function(req, res) {
  res.status(401);
  res.redirect(req.baseUrl + '/error/401');
});

// Handle 403
app.use(function(req, res) {
  res.status(403);
  res.redirect(req.baseUrl + '/error/403');
});

// Handle 500
app.use(function(error, req, res, next) {
  res.status(500);
  console.log(chalk.red(error));
  res.redirect(req.baseUrl + '/error/500');
});



app.listen(port, function () {
  console.log(chalk.green("Running at Port " + port  ));
  console.log(chalk.green('Press CTRL-C to stop'));
})

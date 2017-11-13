var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');

var app = express();

var api = require('./routes/api');
var index = require('./routes/index');
var courses = require('./routes/courses');
var staffs = require('./routes/staffs');
var students = require('./routes/students')
var studentsByDate = require('./routes/studentsdate')
var payments = require('./routes/payments')
var paymentsByDate = require('./routes/paymentsdate')
var paymentsByType = require('./routes/paymentsexpenses')
var studentsByRange = require('./routes/studentsrange')
var attendance = require('./routes/attendance')


// Use native Node promises
mongoose.Promise = global.Promise;
// connect to MongoDB
mongoose.connect('mongodb://localhost/brconcepts')
    .then(() =>  console.log('connection successful'))
    .catch((err) => console.error(err));


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname+'/../../../src')));
app.use(express.static(path.join(__dirname+'/../../webapp')));
app.use(morgan('dev'));
app.use(passport.initialize());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', function(req, res) {
    res.send('Page under construction.');
});


app.use('/api', index);
app.use('/api/users', api);
app.use('/api/courses', courses);
app.use('/api/staffs', staffs);
app.use('/api/students', students);
app.use('/api/studentsByDate',studentsByDate);
app.use('/api/studentsByRange',studentsByRange);
app.use('/api/payments',payments);
app.use('/api/paymentsByDate',paymentsByDate);
app.use('/api/paymentsByType',paymentsByType);
app.use('/api/attendance',attendance);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

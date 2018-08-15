var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');


mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/events', { promiseLibrary: require('bluebird') })
    .then(() => console.log('connection succesful'))
    .catch((err) => console.error(err));

var event_route = require('./routes/event');
var register_route = require('./routes/register');
var login_route = require('./routes/login');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 'extended': 'false' }));
app.use(express.static(path.join(__dirname, 'dist/event-project')));
app.use('/register', express.static(path.join(__dirname, 'dist/event-project')));
app.use('/login', express.static(path.join(__dirname, 'dist/event-project')));
app.use('/event', event_route);
app.use('/api/register', register_route);
app.use('/api/login', login_route);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
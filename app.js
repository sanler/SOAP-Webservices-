/**
 * Module dependencies.
 */

var express = require('express');
var cons = require('consolidate');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var request = require('request');
var swig = require('swig');
var soapU = require('./tempClient');
var app = express();
app.engine('html', cons.swig);
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.set('view cache', false);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

//*********************************************************************
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var async = require('async');
//*********************************************************************


// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', function (req, res) {
    res.render('home.html', { /* template locals context */ });
});
app.get('/', routes.index);
app.get('/users', user.list);

io.sockets.on('connection', function (socket) {

    socket.emit('connected', 'conectado'); //Evento creado por nosotros se puede llamar 'pepito'

    socket.on('message', function (data) {

        var fToC={'data': data, 'conversion': 'CelsiusToFahrenheit', grades: 'Celsius', soap: 'http://tempuri.org/CelsiusToFahrenheit'};

        soapU.soapUse(fToC, function (err, temp) {
            socket.emit('temperatura', temp);
        });
    });

    socket.on('message2', function (data) {

        var fToC={'data': data, 'conversion': 'FahrenheitToCelsius', grades: 'Fahrenheit', soap: 'http://tempuri.org/FahrenheitToCelsius'};

        soapU.soapUse(fToC, function (err, temp) {
            socket.emit('temperatura2', temp);
        });
    });

});

app.get('/temperatura', function (req, res, next) {

    res.render('layout');
});

server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

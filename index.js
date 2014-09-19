/**
* Created with watchtower.
* User: curtismitchell
* Date: 2014-09-19
* Time: 12:50 PM
* To change this template use Tools | Templates.
*/

/*
define(function() {
return {};
});
*/

var express = require('express');
var app = express();
var logger = require('morgan');

// view engine settings
app.set('views', './views');
app.set('view engine', 'html');
app.set('layout', 'layout');
app.set('partials', {
  header: '_shared/_header'
});
app.engine('html', require('hogan-express'));

// logging
app.use(logger('combined'));

// routes
app.get('/', function(req, res) {
   res.render('index.html', {title: "home", content: "you made it."});
});

app.listen(process.env.PORT || 3000, function() {
    console.log('listening...');
});

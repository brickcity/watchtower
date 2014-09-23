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
var Agenda = require('agenda');
var agenda = new Agenda({db: {address: 'localhost:27017/alarmd'}});
var bodyParser = require('body-parser');
var mongoskin = require('mongoskin');
var request = require('request');

var urlencodedParser = bodyParser.urlencoded( {extended: false });

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
  agenda.jobs(function(err, jobs) {
    res.render('index.html', {title: "home", jobs: jobs});
  });
});

app.post('/jobs', urlencodedParser, function(req, res) {
  agenda.define(req.body.url, function (job, done) {
    request.post(req.body.url, function (err, resp, body) {
      job.data = { lastResponse: resp };
      job.save(function(error) {
        done();
      });
    });
  });

  if(!req.body.repeat) {
    console.log('scheduling a one-off');
    agenda.schedule(req.body.startDate || new Date() ,req.body.url);
    res.redirect('/');
  } else {
    console.log('scheduling a repeating job');
    var j = agenda.create(req.body.url);
    j.schedule(req.body.startDate);
    j.save(function(err) {
      var unit = req.body.everyUnit || 1;
      console.log(unit + ' ' + req.body.interval);
      //j.repeatEvery(req.body.everyUnit || 1 + ' ' + req.body.interval);
      //j.save(function(err) {
      res.redirect('/');
      //});
    });
  }
});

app.post('/jobs/:id', function (req,res) {
  agenda.cancel({_id: mongoskin.helper.toObjectID(req.params.id)}, function(err, numRemoved) {
    res.redirect('/');
  });
});

agenda.start();
app.listen(process.env.PORT || 3000, function() {
    console.log('listening...');
});

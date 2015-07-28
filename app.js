//
// [app.js] main controller for flascard.js
//

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var client = require('mongodb').MongoClient;

var index = require('./routes/index');

var app = express();

function replbr (str) {
  return str.replace(/\n/g, '<br />');
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routing
app.use('/', index);

app.get('/books/:bookid?/:section?/:index?',
  function (req, res, next) {
    if (typeof req.params.bookid == 'undefined') {
      res.send('BOOKS');
    } else if (typeof req.params.section == 'undefined') {
      // section selection
    } else {
      var bookid = req.params.bookid;
      var section = req.params.section;
      if (typeof req.params.index == 'undefined') {
        var index = 0;
      } else {
        var index = req.params.index;
      }
      client.connect('mongodb://localhost/flasc', function (err, db) {
        if (err) {
          return console.log(err);
        }
        db.collection('books', function (err, collection) {
          collection.find().toArray(function (err, books) {
            // get data from mongodb
            var cardinfo = books[bookid].sections[section].content[index];
            console.log(cardinfo);
            res.render('card', {
              path: '/books/',
              sections: books[bookid].sections,
              sectionid: Number(section),
              bookid: bookid,
              index: Number(index),
              apath: cardinfo.sound.answer,
              qpath: cardinfo.sound.question,
              question: replbr(cardinfo.question),
              answer: replbr(cardinfo.answer),
              name: cardinfo.name,
              booktitle: books[bookid].title
            });
          });
        });
      });

    }
    
  });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;


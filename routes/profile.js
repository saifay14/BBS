var express = require('express')
var router = express.Router();

router.get('/', function(req, res, next) {
  var ads = [];
  var requests = [];
  var val = req.query[1];
  if (val == undefined)
    val = 0

  var sess = require('./login.js').sess;

  if(sess.email){
    
    var link = '/uploads/' + sess.email + '.jpg'

    var MongoClient = require('mongodb').MongoClient;
    var url = 'mongodb://127.0.0.1:27017/BBS';

    MongoClient.connect(url, function(err, db) {
      if (err) {
        console.log('Unable to connect to the Server:', err);
      } else
      {
        console.log('Connected to Server');
      };

      var points = 0;
      if (val == 0) {
        var cursor = db.collection('ads').find({'email':sess.email});      
        cursor.each(function(err, doc) {
          if(doc != null){
            ads.push(doc);
          }
          else {
            var cursor2 = db.collection('users').find({'email':sess.email});
            cursor2.each(function(err,doc2){
              if(doc2 != null){
                points = doc2.points;
                res.render('profile', { title: 'Profile', name122:sess.name, link1:link, array:ads, val1 : 0, points1:points });
              }
              else
              {
                res.render('profile', { title: 'Profile', name122:sess.name, link1:link, array:ads, val1 : 0, points1:0 });
              }
            });
          };
        });
      }
      else
      {
        var cursor = db.collection('requests').find({'email':sess.email});      
        cursor.each(function(err, doc) {
          if(doc != null){
            requests.push(doc);  
          }
          else {
            var cursor2 = db.collection('users').find({'email':sess.email});
            cursor2.each(function(err,doc2){
              if(doc2 != null){
                points = doc2.points;
                res.render('profile', { title: 'Profile', name122:sess.name, link1:link, array:requests, val1 : 1, points1:points });
              }
              else
              {
                res.render('profile', { title: 'Profile', name122:sess.name, link1:link, array:requests, val1 : 1, points1:0 });
              }
            });
          }
        });
      };
    });
  }
  else
  {
    res.redirect('/');
  }
	
});

module.exports = router;

var express = require('express');
var router = express.Router();

const config = require('../config/presentation');

router.get('/', function(req, res) {
  res.redirect('/new');
});

router.get('/new', function(req, res, next) {
  res.render('new', { title: 'Create new presentation', all: JSON.stringify(config) });
});

router.get('/p/:batch/:pid/:ms/:topic', function(req, res) {
  var p = req.params;
  res.render(p.batch + '/' + p.topic, { title: config[p.batch][p.topic].title });
});

router.get('/nd/p/:batch/:topic', function(req, res) {
  var p = req.params;
  res.render(p.batch + '/' + p.topic, { title: config[p.batch][p.topic].title });
});


router.post('/np', function(req, res, next) {
  global._ps[req.body.pid] = {
    users: {},
    master: null
  };
  res.json({ok:true});
});



module.exports = router;

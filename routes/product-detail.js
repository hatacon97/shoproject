var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('product-detail', { 
    title: 'home' 
  });
});

module.exports = router;

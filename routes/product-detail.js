var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('product-detail', { 
    title: '상세페이지' 
  });
});

module.exports = router;

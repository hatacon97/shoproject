var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('prodRegsite', { 
    title: '상품 등록' 
  });
});

module.exports = router;

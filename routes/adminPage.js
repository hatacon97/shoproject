var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('adminPage', { 
    title: '어드민 페이지' 
  });
});

module.exports = router;

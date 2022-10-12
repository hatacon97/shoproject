var express = require('express');
var router = express.Router();

router.get('/', (req,res)=>{
  let route = req.app.get('views') + '/user/cart';
  res.render(route, {
    title: "장바구니"
  })
});

module.exports = router;

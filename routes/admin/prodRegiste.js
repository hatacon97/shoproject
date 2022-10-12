var express = require('express');
var router = express.Router();

router.get('/', (req,res)=>{
  let route = req.app.get('views') + '/admin/prodRegiste';
  res.render(route, {
    layout: false,
    title: "상품등록"
  })
});

module.exports = router;

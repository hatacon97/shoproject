var express = require('express');
var router = express.Router();

const login = require('./login');
const prodList = require('./user/productList.js');
const home = require('./user/home.js')
const adminPage = require('./admin/adminPage.js');
const prodRegiste = require('./admin/prodRegiste.js');
const prodDetail = require('./user/product-detail.js');
const memberRegiste = require('./user/registe.js');
const cart = require('./user/cart.js');
const insertCart = require('./user/insertCart');
const payment = require('./user/payment.js');


/* GET home page. */
router.use('/', (req,res,next) => {
  if(req.url == '/' || req.url == '/login' || req.url == '/user/registe') {
      // console.log("세션 검사 하지않고 로그인페이지로")
      next();
  } else {                                            // 로그인 페이지 이외의 페이지에 진입하려고 하는 경우
      if(req.session.user) {
          // console.log("세션이 있다.")
          next();                        // user와 admin이 같은 페이지를 이용할 때 구분해줘야 할 때
      } else {
          // console.log("세션이 없다.")
          res.send("<script>alert('로그인이 필요합니다.');location.href='/'</script>");
      }
  }
});

// 로그인
router.use('/', login);

// 회원
router.use('/user/productList', prodList);
router.use('/user/home', home);
router.use('/user/product-detail', prodDetail)
router.use('/user/registe', memberRegiste)
router.use('/user/cart', cart)
router.use('/user/insertCart', insertCart)
router.use('/user/payment', payment)


// 관리자
router.use('/admin/adminPage', adminPage);
router.use('/admin/prodRegiste', prodRegiste);

module.exports = router;

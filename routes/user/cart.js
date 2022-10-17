var express = require('express');
var router = express.Router();
var oracledb = require('oracledb');
oracledb.autoCommit = true;
const {
  ORACLE_CONFIG
} = require('../../config/db')

router.get('/', async function(req, res, next){
  const userId = req.session.user.sessionId;
  console.log(userId)
  cart = await selectCart(userId);
  console.log(cart)
  if(cart == 0){ //장바구니가 없을 시
    //장바구니 생성
    await insertCart(userId);
    //장바구니 물품 조회
    cartProduct = await selectCartProduct(userId);
    console.log(cartProduct)
  } else {

    cartProduct = await selectCartProduct(userId);
    console.log(cartProduct)
  }

  res.render('user/cart', {
    cartProduct: cartProduct
  });
});

//장바구니 조회
async function selectCart(userId){
  let connection = await oracledb.getConnection(ORACLE_CONFIG);
  var sql = "SELECT * FROM CART WHERE USER_ID = :id";
  let options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT
  };
  let result = await connection.execute(sql, [userId], options);
  console.log(result)
  await connection.close();

  return result.rows;
}

//장바구니 없는 사람들 추가
async function insertCart(userId){
  let connection = await oracledb.getConnection(ORACLE_CONFIG);
  var sql2 = "INSERT INTO CART(cart_no, user_id) \
              values ( (select NVL(MAX(CART_NO),0)+1 FROM CART), :id)";
  let options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT
  };
  await connection.execute(sql2, [userId], options);

  await connection.close();
}

//장바구니 물품 조회
async function selectCartProduct(userId){
  let connection = await oracledb.getConnection(ORACLE_CONFIG);
  var sql3 = "select c.*, p.prod_nm, p.prod_img, (c.prod_cnt * p.prod_price) sum_price \
              from cart_product c\
              left join product p on c.prod_id = p.prod_no\
              where c.cart_no = (SELECT CART_NO FROM CART WHERE USER_ID = :id) \
              order by c.cart_prod_no desc";
  let options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT
  };
  let result = await connection.execute(sql3, [userId], options);
  console.log("===="+result.rows)
  await connection.close();

  return result.rows;
}

module.exports = router;

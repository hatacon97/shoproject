var express = require('express');
var router = express.Router();
var oracledb = require('oracledb');
oracledb.autoCommit = true;
const {
  ORACLE_CONFIG
} = require('../../config/db')

router.get('/', async function(req, res, next){
  const userId = req.session.user.sessionId;
  cart = await selectCart(userId);
  if(cart == 0){ //장바구니가 없을 시
    //장바구니 생성
    await insertCart(userId);
    //장바구니 물품 조회
    cartProduct = await selectCartProduct(userId);
  } else {

    cartProduct = await selectCartProduct(userId);
  }
  var sumPrice = 0;
  for(j=0; j < cartProduct.length; j++){
    sumPrice += cartProduct[j].SUM_PRICE
  }
  res.render('user/cart', {
    cartProduct: cartProduct,
    sumPrice: sumPrice
  });
});

//장바구니 상품 삭제
router.post('/del_cartProd', async function(req, res, next){
  const cartChk = JSON.parse("[" + req.body.cartChk + "]")
  await delCartProd(cartChk)
  res.send("<script>alert('장바구니에서 상품이 삭제되었습니다.');location.href='/user/cart'</script>")

});
async function delCartProd(cartChk){
  let connection = await oracledb.getConnection(ORACLE_CONFIG)

  var sql4 = "DELETE FROM CART_PRODUCT WHERE CART_PROD_NO = :no"
  if(cartChk.length > 1){
    for(i=0; i < cartChk.length-1; i++){
      sql4 += " OR CART_PROD_NO = :no"
    }
  }
  let options ={
    outFormat: oracledb.OUT_FORMAT_OBJECT
  };
  await connection.execute(sql4, cartChk, options)

  await connection.close();
}

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
  await connection.close();

  return result.rows;
}

module.exports = router;

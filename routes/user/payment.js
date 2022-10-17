var express = require('express');
var router = express.Router();
var oracledb = require('oracledb');
oracledb.autoCommit = true;
const {
    ORACLE_CONFIG
} = require('../../config/db')

//결제 페이지로 이동
router.post('/', async function(req, res, next){
    const cartChk = JSON.parse("[" + req.body.cartChk + "]")
    const buyProd = await selectCartProd(cartChk)
    var sumPrice = 0;
    for(i=0; i < buyProd.length; i++){
        sumPrice += buyProd[i].SUM_PRICE
    }
    res.render('user/payment',{
        buyProd: buyProd,
        sumPrice: sumPrice
    });
});

router.post('/buyProd', async function(req, res, next){
    const param = [req.body.prodNM, path[0], req.body.prodPrice, req.body.prodDetail, req.body.prodCnt, req.body.prodDiv]
    await insertProduct(param)

    res.send("<script>alert('정상적으로 구매가 완료 되었습니다.');location.href='/user/home'</script>");
});

//상품 등록
async function selectCartProduct(cartChk){
    let connection = await oracledb.getConnection(ORACLE_CONFIG);

    var sql = "SELECT CP.*, P.PROD_NM, (P.PROD_PRICE * CP.PROD_CNT) AS SUM_PRICE, P.PROD_IMG \
                FROM CART_PRODUCT CP LEFT JOIN PRODUCT P \
                ON CP.PROD_ID = P.PROD_NO \
                WHERE CART_PROD_NO = :cartChk";
    if(cartchk.length > 1) {
        for(j=0; j<cartChk.length-1; j++){
            sql += "OR CART_PROD_NO = :cartChk"
        }
    }

    let options = {
        outFormat: oracledb.OUT_FORMAT_OBJECT
    };

    let result = await connection.execute(sql, cartChk, options);

    await connection.close();

    return result.rows;
}

module.exports = router;
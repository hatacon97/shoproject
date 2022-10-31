var express = require('express');
var router = express.Router();
var oracledb = require('oracledb');
oracledb.autoCommit = true;
const {
    ORACLE_CONFIG
} = require('../../config/db')

//결제 페이지로 이동
router.post('/', async function(req, res, next){

    const userId = req.session.user.sessionId;
    const cartChk = JSON.parse("[" + req.body.cartChk + "]")
    const buyProd = await selectCartProd(cartChk)
    const member = await selectMember(userId)
    var sumPrice = 0;
    for(i=0; i < buyProd.length; i++){
        sumPrice += buyProd[i].SUM_PRICE;
    }
    res.render('user/payment', {
        buyProd: buyProd,
        sumPrice: sumPrice,
        member: member
    });
});

router.post('/buyProd', async function(req, res, next){
    console.log(req.body)
    const cart_prod_no = ['9','8'];
    console.log(cart_prod_no);
    for(j=0; j<cart_prod_no.length; j++){
        await updateProduct([cart_prod_no[j]])
        await delCartProd([cart_prod_no[j]]);
    }
    

    res.send({msg : 'success'});
});

//상품 등록
async function selectCartProd(cartChk){
    let connection = await oracledb.getConnection(ORACLE_CONFIG);

    var sql = "SELECT CP.*, P.PROD_NM, (P.PROD_PRICE * CP.PROD_CNT) AS SUM_PRICE, P.PROD_IMG, P.PROD_PRICE, CP.PROD_CNT \
                FROM CART_PRODUCT CP LEFT JOIN PRODUCT P \
                ON CP.PROD_ID = P.PROD_NO \
                WHERE CART_PROD_NO = :cartChk";

    if(cartChk.length > 1) {
        for(j=0; j<cartChk.length-1; j++){
            sql += " OR CART_PROD_NO = :cartChk"
        }
    }

    let options = {
        outFormat: oracledb.OUT_FORMAT_OBJECT
    };

    let result = await connection.execute(sql, cartChk, options);

    await connection.close();

    return result.rows;
}

async function selectMember(userId){
    let connection = await oracledb.getConnection(ORACLE_CONFIG);

    var sql2 = "SELECT * FROM MEMBER WHERE USER_ID = :id"

    let options ={
        outFormat: oracledb.OUT_FORMAT_OBJECT
    };
    let result2 = await connection.execute(sql2, [userId], options)

    await connection.close();

    return result2.rows;
}

async function delCartProd(cart_prod_no){
    let connection = await oracledb.getConnection(ORACLE_CONFIG);

    let options = {
        outFormat: oracledb.OUT_FORMAT_OBJECT
    };
    var sql = "DELETE FROM CART_PRODUCT WHERE CART_PROD_NO = :cart_prod_no";


    await connection.execute(sql, cart_prod_no, options)

    await connection.close();
}

async function updateProduct(cart_prod_no){
    let connection = await oracledb.getConnection(ORACLE_CONFIG);

    let options ={
        outFormat: oracledb.OUT_FORMAT_OBJECT
    }
    var sql = "UPDATE PRODUCT SET PROD_CNT = PROD_CNT - (SELECT PROD_CNT FROM CART_PRODUCT WHERE CART_PROD_NO = :no) WHERE PROD_NO = :no2";
    console.log(cart_prod_no)
    await connection.execute(sql, [cart_prod_no[0], cart_prod_no[0]], options)

    await connection.close();
}

module.exports = router;
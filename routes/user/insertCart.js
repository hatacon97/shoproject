var express = require('express');
const { OUT_FORMAT_OBJECT } = require('oracledb');
var router = express.Router();

var oracledb = require('oracledb');
oracledb.autoCommit = true;
const {
    ORACLE_CONFIG
} = require('../../config/db');

//장바구니 조회 및 등록
router.post('/', async function(req, res, next){
    //세션에 저장된 유저 정보
    const userId = req.session.user.sessionId;
    cart = await selectCart(userId);
    console.log(cart);
    const param = [req.body.PROD_NO, req.body.count, userId]
    console.log(param);
    try {
        if(cart == 0){ //장바구니가 없을떄

            //장바구니 생성
            await insertCart(userId);
            //장바구니 담기
            cartProduct = await insertCartProduct(param)

        } else { //장바구니가 이미 있는 경우
            //장바구니 담기
            cartProduct = await insertCartProduct(param)

        }
        res.json({result: "success"});
    } catch (e) {
        console.log(e)
    }
});

//장바구니 조회
async function selectCart(userId){
    let connection = await oracledb.getConnection(ORACLE_CONFIG);
    var sql = "SELECT * FROM CART WHERE USER_ID = :id";
    let options = {
        outFormat: oracledb.OUT_FORMAT_OBJECT
    };

    let result = await connection.execute(sql, [userId], options);

    await connection.close();

    return result.rows;
}

//장바구니 물품 추가
async function insertCartProduct(param){
    let connection = await oracledb.getConnection(ORACLE_CONFIG);
    var sql2 = "INSERT INTO CART_PRODUCT(cart_prod_no, prod_id, prod_cnt, cart_no)\
                values ( (select NVL(MAX(CART_PROD_NO),0)+1 FROM CART_PRODUCT), :prodno, :count, (SELECT CART_NO FROM CART WHERE USER_ID = :userId)) "
    let options = {
        outFormat: oracledb.OUT_FORMAT_OBJECT
    };
    console.log(param);
    await connection.execute(sql2, param, options)
    await connection.close();

}

//장바구니 없는 사람들 추가
async function insertCart(userId){
    let connection = await oracledb.getConnection(ORACLE_CONFIG);
    var sql3 = "INSERT INTO CART(cart_no, user_id)\
                values( (select NVL(MAX(CART_NO),0)+1 FROM CART), :id)"
    let options ={
        outFormat: oracledb.OUT_FORMAT_OBJECT
    };
    await connection.execute(sql3,[userId], options)

    await connection.close();
}

module.exports = router;
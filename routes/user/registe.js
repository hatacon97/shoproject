var express = require('express');
var router = express.Router();
var oracledb = require('oracledb')
const {
    ORACLE_CONFIG
} = require('../../config/db')

router.get('/', async (req, res) => {
  let route = req.app.get('views')+ '/user/registe';
  res.render(route, {
    title: '회원가입'
  })
});

router.post('/userInsert', async function(req, res, next){
  const param = [req.body.user_nm, req.body.user_ph, req.body.user_email, req.body.user_pw, req.body.sample6_postcode, req.body.sample6_address, req.body.sample6_detailAddress]

  await insertMember(param)
  res.send("<script>alert('회원가입이 완료되었습니다.');location.href='/user/home'</script>");

});
async function insertMember(param){
  let connection = await oracledb.getConnection(ORACLE_CONFIG);
  var sql = "INSERT INTO MEMBER(USER_ID, USER_NM, USER_PH, USER_EMAIL, USER_PW, USER_POSTCODE,\
            USER_ADDR, USER_DETAIL_ADDR, USER_DATE)\
            values((SELECT NVL(MAX(USER_ID),0)+1 FROM MEMBER), :name, :ph, :email, :pw, :postcode, :addr, :detailAddr, TO_CHAR(SYSDATE, 'yyyy-mm-dd HH:mi:ss')) ";
  let options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT
  };
  await connection.execute(sql, param, options)

  await connection.close();

}

module.exports = router;
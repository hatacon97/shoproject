var express = require('express');
var router = express.Router();
var oracledb = require('oracledb')
const {
    ORACLE_CONFIG
} = require('../../config/db')

router.get('/', async (req, res) => {
  let route = req.app.get('views')+ '/user/registe';
  let results = await insertMember()
  res.render(route, {
    results: results
  })
});

async function insertMember(user_nm, user_email,user_pw, user_ph, sample6_postcode, sample6_address, sample6_detailAddress){
  try{
  let connection = await oracledb.getConnection(ORACLE_CONFIG);

  let sql = "insert into member (user_nm, user_ph, user_email, user_pw, user_postcode, user_addr, user_detail_addr) \
             values (user_nm, user_ph, user_email, user_pw, sample6_postcode, sample6_address, sample6_detailAddress)";
  let params = [user_nm, user_email,user_pw, user_ph, sample6_postcode, sample6_address, sample6_detailAddress];
  let options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT
  };
  let result = await connection.execute(sql, params, options);

  await connection.close();
 } catch (error){
  console.log(error.message)
 }
}

module.exports = router;
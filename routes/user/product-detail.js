var express = require('express');
var router = express.Router();
var oracledb = require('oracledb')
const {
  ORACLE_CONFIG
} = require('../../config/db')

router.get('/', async (req, res)=>{
  const PROD_NO = req.query.PROD_NO == undefined ? 1 : req.query.PROD_NO;
  let route = req.app.get('views') + '/user/product-detail';
  let results = await selectProduct(PROD_NO);
  let results2 = await selectProdFile(PROD_NO);
  res.render(route, {
    prod_detail: results,
    prod_detailFile: results2
  })
  console.log(results)
});

async function selectProduct(PROD_NO){
  let connection = await oracledb.getConnection(ORACLE_CONFIG);
  var sql = "SELECT * FROM PRODUCT WHERE PROD_NO = :PROD_NO"

  let options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT
  };
  let result = await connection.execute(sql, [PROD_NO], options);

  await connection.close();
 
  return result.rows;
}

async function selectProdFile(PROD_NO){
  let connection = await oracledb.getConnection(ORACLE_CONFIG);
  var sql2 = "SELECT * FROM FILE_PATH WHERE PROD_NO = :PROD_NO"

  let options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT
  };

  let result2 = await connection.execute(sql2, [PROD_NO], options);

  await connection.close();

  return result2.rows;
}





module.exports = router;

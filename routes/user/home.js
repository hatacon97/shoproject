var express = require('express');
var router = express.Router();
var oracledb = require('oracledb')
const {
    ORACLE_CONFIG
} = require('../../config/db')


router.get('/', async (req, res) => {
  let route = req.app.get('views') + '/user/home';
  let results = await selectProduct();
  res.render(route, {
      results: results
  })
  console.log(results);
})

async function selectProduct() {

  let connection = await oracledb.getConnection(ORACLE_CONFIG);

  let sql = "SELECT * FROM \
              (SELECT PROD_IMG, PROD_PRICE, PROD_NM, PROD_NO, TO_DATE(PROD_DATE, 'yyyy-MM-dd HH:mi:ss') as PROD_DATE_FMT \
              FROM PRODUCT ORDER BY PROD_DATE_FMT DESC) \
              WHERE ROWNUM <= 8"

  let binds = {};
  let options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT   // query result format
    };

  let results = await connection.execute(sql, binds, options);

  // console.log(result.rows);
  
  await connection.close();
  
  return results.rows
}

module.exports = router;
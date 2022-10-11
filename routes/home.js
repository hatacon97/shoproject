var express = require('express');
var router = express.Router();
var oracledb = require('oracledb')
const {
    ORACLE_CONFIG
} = require('../config/db')


router.get('/', async (req, res) => {
  let route = req.app.get('views') + '/home';
  let results = await selectProduct();
  res.render(route, {
      layout: false,
      results: results
  })
  console.log(results);
})

async function selectProduct() {

  let connection = await oracledb.getConnection(ORACLE_CONFIG);

  let binds = {};
  let options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT   // query result format
    };

  let results = await connection.execute("select * from product", binds, options);

  // console.log(result.rows);
  
  await connection.close();
  
  return results.rows
}

module.exports = router;
var express = require('express');
var router = express.Router();
var oracledb = require('oracledb');

const {
  ORACLE_CONFIG
} = require('../../config/db')

router.get('/', async function(req, res, next) {
  let results = await viewAdminPage();
  res.render('admin/adminPage', {
     results: results,
     title: '관리자 페이지',
     layout: false
    });
    console.log(results)
});

async function viewAdminPage(){
  let connection = await oracledb.getConnection(ORACLE_CONFIG);

  let binds = {};
  let options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT
  };

  let results = await connection.execute("select * from product", binds, options)

  await connection.close();
  
  return results.rows
}


module.exports = router;

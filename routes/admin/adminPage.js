var express = require('express');
var router = express.Router();
var oracledb = require('oracledb');

const {
  ORACLE_CONFIG
} = require('../../config/db')

router.get('/', async (req,res)=>{
  let route = req.app.get('views') + '/admin/adminPage';
  let results = await viewAdminPage();
  res.render(route, {
    layout: false,
    results: results,
    title: "어드민 페이지"
  })
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

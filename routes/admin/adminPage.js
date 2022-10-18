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

router.post('/delete_prod', async function(req, res, next){
  const del_chk = JSON.parse("[" + req.body.del_chk + "]")
  await delProd(del_chk)
  res.send("<script>alert('상품이 정상적으로 삭제되었습니다.');location.href='/admin/adminPage'</script>")
});
async function delProd(del_chk){
  let connection = await oracledb.getConnection(ORACLE_CONFIG);

  var sql = "DELETE FROM PRODUCT WHERE PROD_NO = :no"
  if(del_chk.length > 1){
    for(i=0; i<del_chk.length-1; i++){
      sql += " OR PROD_NO = :no"
    }
  }
  let options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT
  };
  await connection.execute(sql, del_chk, options)

  await connection.close();
}

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

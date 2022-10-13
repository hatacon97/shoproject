var express = require('express');
var router = express.Router();
var oracledb = require('oracledb');
const {
  ORACLE_CONFIG
} = require('../../config/db');

const multer = require('multer');
const path = require('path');
const fs= require('fs');

var upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      fs.mkdir('public/assets/images/products', function(err){
        if(err && err.code != 'EEXIST') {
          console.log("already exist")
        } else {
          callback(null, 'public/assets/images/products');
        }
      })
    },
    filename: (req, file, done) => {
      const ext = path.extname(file.originalname);
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    }
  })
})

router.get('/', function(req, res, next) {
  res.render('admin/prodRegiste', {
     title: '상품등록',
     layout: false 
    });
});

router.post('/insert', upload.array('file'), async function(req, res, next){

  const paths = req.files.map(data => data.path);

  const orgNm = req.files.map(data => data.originalname);

  const param = [req.body.productName, req.body.productPrice, req.body.productDetail, req.body.prodcutCount, req.body.productDisCount, req.body.productDiv, paths[0]]
  
  await prodRegiste(param)

  for(let i=1; i < paths.length; i++){
    const param2 = [paths[i], i, path.extname(paths[i]), orgNm[i]]
    await insertFile(param2)
  };

  res.send("<script>alert('정상적으로 등록이 완료되었습니다.');location.href='/admin/adminPage'</script>");

});

async function prodRegiste(param){
  let connection = await oracledb.getConnection(ORACLE_CONFIG);
  var sql = "INSERT INTO PRODUCT(PROD_NO, PROD_NM, PROD_PRICE, PROD_DETAIL, PROD_CNT,\
              PROD_DISCT, PROD_DIV, PROD_IMG, PROD_DATE) \
              values((SELECT NVL(MAX(PROD_NO),0)+1 FROM PRODUCT), :name, :price, :detail, :count, :disct, :div, :path, TO_CHAR(SYSDATE, 'yyyy-mm-dd HH:mi:ss'))";
  
  let options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT
  };
  await connection.execute(sql, param, options)

  await connection.close();
}

async function insertFile(param2){

  let connection = await oracledb.getConnection(ORACLE_CONFIG);
  var sql = "INSERT INTO FILE_PATH(FILE_ROUTE, FILE_NO, FILE_TYPE, FILE_ORIGINAL, PROD_NO)\
              values (:fileRoute, :fileNo, :fileType, :fileOrgNm, (select MAX(PROD_NO) FROM PRODUCT) )";
  let options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT
  };
  await connection.execute(sql, param2, options);

  await connection.close();

}

module.exports = router;

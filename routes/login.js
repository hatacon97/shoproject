var express = require('express');
var router = express.Router();
var oracledb = require('oracledb')
const {
    ORACLE_CONFIG
} = require('../config/db')

router.get('/', function(req, res, next) {
  res.render('login', { 
    title: '로그인' 
  });
});

router.post('/login', async(req, res)=>{
    const user = req.body.user_email;
    result = await loginDatabase();
    console.log(result);
    console.log(user);
})

//select
async function loginDatabase() {

    let connection = await oracledb.getConnection(ORACLE_CONFIG);

    let binds = {};
    let options = {
        outFormat: oracledb.OUT_FORMAT_OBJECT   // query result format
      };

    let result = await connection.execute("select * from member where user_id = :user_id", binds, options);

    console.log(result.rows);
    
    await connection.close();
    
    return result.rows
}
module.exports = router;

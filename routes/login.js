var express = require('express');
var router = express.Router();
var oracledb = require('oracledb');
const {
    ORACLE_CONFIG
} = require("../config/db");


//로그인 페이지로 이동
router.get('/', (req, res) => {
  let route = req.app.get('views') + '/login';
  res.render(route, {
      layout: false
  })
})

//로그인
router.post('/login', async (req, res) => {
  const auth = req.body.user_id
  result = await selectDatabase();
  console.log(result)
console.log(auth)
  if (auth == 'admin') {
      if (req.session.user) {
          res.redirect('/home');
      } else { // 세션 없는 admin일 경우 만들어줌
          req.session.user = {
              sessionId: auth
          };
          res.redirect('/home');
      }
  } else if(auth == null || auth == ""){
      return res.send('<script>alert("아이디 또는 비밀번호를 잘못 입력했습니다."); location.href = document.referrer;</script>');
  } else{
    if (req.session.user) {
        res.redirect('/home');
    } else { // 세션 없는 admin일 경우 만들어줌
        req.session.user = {
            sessionId: auth
        };
        res.redirect('/home');
    }
  }


});

//select
async function selectDatabase() {

    let connection = await oracledb.getConnection(ORACLE_CONFIG);

    let binds = {};
    let options = {
        outFormat: oracledb.OUT_FORMAT_OBJECT   // query result format
      };

    let result = await connection.execute('select * from "user"', binds, options);

    // console.log(result.rows);
    
    await connection.close();
    
    return result.rows[0]
}

module.exports = router;

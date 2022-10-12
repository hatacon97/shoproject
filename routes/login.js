var express = require('express');
var router = express.Router();
var oracledb = require('oracledb')
const {
    ORACLE_CONFIG
} = require('../config/db')

router.get('/', (req, res)=>{
  let route = req.app.get('views') + '/login';
  res.render(route, {
    layout: false
  })
});

router.post('/login', async (req, res)=>{
  const loginEmail = req.body.loginEmail;
  const lgoinPwd = req.body.loginPw;

  result = await selectUser(loginEmail, lgoinPwd);

  try{
    if(result == undefined){
      res.send('<script>alert("아이디 또는 비밀번호를 잘못 입력했습니다."); location.href = document.referrer;</script>');
    } else {
      const userName = result.USER_NM

      if(result.USER_AUTH == 'admin'){
        if(req.session.user){
          res.redirect('/admin/adminPage');
        }else{
          req.session.user = {
            sessionEmail:loginEmail,
            sessionName: userName
          };
          res.redirect('/admin/adminPage');
        }
      } else if (result.USER_AUTH == 'user'){
        if(req.session.user) {
          res.redirect('/user/home');
        } else {
          req.session.user = {
            sessionEmail: loginEmail,
            sessionName: userName
          };
          res.redirect('/user/home');
        }
      }
    }
  } catch(error){
    console.log(error.message);
  }

});

router.get('/logout', async (req, res) =>{
  if(req.session.user) {
    req.session.destroy(function (err){
      if(err) throw err;
      res.send("<script>alert('로그아웃 되었습니다.'); location.href='/'</script>"); // 로그인 페이지로 이동
    })
  } else {
    res.redirect('/');
  }
});

async function selectUser(user_email, user_pw) {
  try {
    let connection = await oracledb.getConnection(ORACLE_CONFIG);
    
    let sql = "select user_email, user_nm, user_auth from member \
               where user_email = :email and user_pw = :pwd";
    let param = [user_email, user_pw];
    let options ={
      outFormat: oracledb.OUT_FORMAT_OBJECT
    };
    let result = await connection.execute(sql, param, options);

    await connection.close();

    return result.rows[0];

  } catch (error) {
    console.log(error.message);
  }
}

module.exports = router;

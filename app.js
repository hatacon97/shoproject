var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
const session = require('express-session');
var oracledb = require('oracledb');
oracledb.autoCommit = true;


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var homeRouter = require('./routes/home')
var detailRouter = require('./routes/product-detail')
var loginRouter = require('./routes/login')
var regiRouter = require('./routes/registe')
var prodListRouter = require('./routes/productList')
var prodRegsiteRouter = require('./routes/prodRegsite')
var adminPageRouter = require('./routes/adminPage')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', homeRouter);
app.use('/users', usersRouter);
app.use('/test', indexRouter);
app.use('/product-detail', detailRouter)
app.use('/login', loginRouter)
app.use('/registe', regiRouter)
app.use('/productList', prodListRouter)
app.use('/prodRegsite', prodRegsiteRouter)
app.use('/adminPage', adminPageRouter)

// 세션 설정
app.use( // request를 통해 세션 접근 가능 ex) req.session
  session({
    // key: "loginData",
    secret: "keyboard cat", // 반드시 필요한 옵션. 세션을 암호화해서 저장함
    resave: false, // 세션 변경되지 않아도 계속 저장됨. 기본값은 true지만 false로 사용 권장
    saveUninitialized: true, // 세션을 초기값이 지정되지 않은 상태에서도 강제로 저장. 모든 방문자에게 고유 식별값 주는 것.
    cookie: {
      maxAge: 3600000
    },
    rolling: true
    // store: new MYSQLStore(connt),
  })
);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

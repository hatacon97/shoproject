const mysql = require('mysql')

const connection = mysql.createConnection({
    host: `localhost`,
    user: `root`,
    password: `123456`,
    port: 3306,
    database: `shopingmall`
});
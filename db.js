//MySQL
var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'dic-enc-slv.mydb.daumkakao.io',
    user     : 'dicuser',
    password : 'dicuser_anal',
    database : 'encyclopedia'
});
connection.connect();

exports.connection = connection;
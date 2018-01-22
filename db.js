var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'cig4l2op6r0fxymw.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
  user: 'bqh05s4gcv0ywgdy',
  password: 'zadfqd8nr88drfpi',
  database: 'nngvgcouyondqbrv'
});

connection.connect();

exports.connection = connection;
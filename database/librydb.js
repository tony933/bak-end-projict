const { Module } = require('module'),
 mysql = require('mysql'),
 { promisify }  = require('util');

// connection in databases mysql
var pool  = mysql.createPool({
host:  process.env.DB_HOST,
user: process.env.DB_USER,
password: process.env.DB_PASSWORD,
database : process.env.DB_DATABASE
})
pool.getConnection(function(err) {
if (err) {
   console.log(`something want wrong:$[err]`)
} else {
    console.log("Connected!");
}

})
const promiseQuery = promisify(pool.query).bind(pool);

module.exports = promiseQuery
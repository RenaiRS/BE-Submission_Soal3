var mysql = require('mysql');

var database = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "be_submission"
});

database.connect(function (err) {
    if (err) throw err;
    console.log("Terhubung ke Database");
});

module.exports = database;

const mysql = require('mysql');
var connection = mysql.createConnection({
    host : 'localhost',
    database : 'employe',
    user : 'root',
    password : 'Fruity@456'
});
connection.connect(function(error){
    if(error){
        throw error;
    }
    else{
        console.log("database connected");
    }
});
module.exports = connection;
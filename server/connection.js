const mysql = require('mysql');

/**
 * Establish connection to the mysql database.
 */
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'deaquiadonde'
});

/**
 * Create connection with the server.
 */
connection.connect(
    (error)=>{
        if(error){
            throw error;
        }
        else{
            console.log('Connection successful');
        }
    }
);

/**
 * Exports the connection with the server.
 */
module.exports = connection;

/**
 * COMMAND FOR TESTING:
 * node server\connection.js
 */
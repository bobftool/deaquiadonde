const mysql = require('mysql');

/**
 * Establish connection to the mysql database.
 */
const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
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
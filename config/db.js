// config to handle database connection use or not
const databaseAvailable = false;


require('dotenv').config();
const mysql = require('mysql2');


let db;

if(databaseAvailable) {
    db = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    db.connect((error) => {
        if (error) {
            console.error('ERROR: Database connection failed:', error);
            process.exit(1);
        }
        console.log('Successfully connected to the database');
    });
}


module.exports = db;
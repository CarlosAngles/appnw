const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: '', 
    database: 'control_gastos',
});

db.connect((err) => {
    if (err) throw err;
    console.log('Conexión a la base de datos establecida');
});

module.exports = db;

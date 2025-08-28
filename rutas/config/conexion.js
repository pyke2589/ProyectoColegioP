const express = require('express');
const mysql = require('mysql2');
const app = express();
const puerto = 4500;
app.use(express.json());

const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234567',
    database: 'colegiopublico'
});

conexion.connect((err) => {
    if (err) {
        throw err;
    } else {
        console.log('Conexión exitosa a la base de datos colegiopublico');
    }
});

app.listen(puerto, () => {
    console.log('Servidor levantado en el puerto', puerto);
});

module.exports = { app, conexion, puerto };
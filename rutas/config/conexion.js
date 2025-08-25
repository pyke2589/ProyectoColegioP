const express = require('express');
const mysql = require('mysql2');
const app = express();
const puerto = 3000;
app.use(express.json());

const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'ColegioPublico'
});

conexion.connect((err) => {
    if (err) {
        throw err;
    } else {
        console.log('Conexión exitosa a la base de datos ColegioPublico');
    }
});

app.listen(puerto, () => {
    console.log('Servidor levantado en el puerto', puerto);
});

module.exports = { app, conexion, puerto };
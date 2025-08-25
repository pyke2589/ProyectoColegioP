const express = require('express');
const router = express.Router();
const { conexion } = require('./config/conexion');

router.get('/aulas', (req, res) => {
    let sql = 'SELECT * FROM TAulas';
    conexion.query(sql, (err, result) => {
        if (err) {
            console.log('Error en la consulta', err);
        } else {
            res.send(result);
        }
    });
});

router.post('/aulas', (req, res) => {
    let sqlMax = 'SELECT IFNULL(MAX(id_aula), 0) AS maxId FROM TAulas';
    conexion.query(sqlMax, (err, result) => {
        if (err) {
            console.log('Error al obtener último id_aula', err);
            return res.status(500).json({ mensaje: 'Error al generar ID' });
        }

        let nuevoId = result[0].maxId + 1;
        let data = {
            id_aula: nuevoId,
            nombre: req.body.nombre,
            ubicacion: req.body.ubicacion || null,
            tipo_aula: req.body.tipo_aula,
            capacidad: req.body.capacidad
        };
        let sqlInsert = 'INSERT INTO TAulas SET ?';
        conexion.query(sqlInsert, data, (err, resul) => {
            if (err) {
                console.log('Error en el insert', err);
                res.status(500).json({ mensaje: 'Error al insertar' });
            } else {
                res.json({ mensaje: 'Aula creada', id_generado: nuevoId, data: data });
            }
        });
    });
});

router.put('/aulas/:id', (req, res) => {
    let id = req.params.id;
    let data = {
        nombre: req.body.nombre,
        ubicacion: req.body.ubicacion || null,
        tipo_aula: req.body.tipo_aula,
        capacidad: req.body.capacidad
    };
    let sql = 'UPDATE TAulas SET ? WHERE id_aula = ?';
    conexion.query(sql, [data, id], (err, result) => {
        if (err) {
            console.log('Error en el update', err);
        } else {
            res.json({ mensaje: 'Aula actualizada correctamente' });
        }
    });
});

router.delete('/aulas/:id', (req, res) => {
    let id = req.params.id;
    let sql = 'DELETE FROM TAulas WHERE id_aula = ?';
    conexion.query(sql, [id], (err, result) => {
        if (err) {
            console.log('Error al eliminar aula', err);
            res.status(500).json({ mensaje: 'Error al eliminar' });
        } else {
            res.json({ mensaje: 'Aula eliminada correctamente' });
        }
    });
});

module.exports = router;
const express = require('express');
const router = express.Router();
const { conexion } = require('./config/conexion');

router.get('/asignaturas', (req, res) => {
    let sql = 'SELECT * FROM TAsignaturas';
    conexion.query(sql, (err, result) => {
        if (err) {
            console.log('Error en la consulta', err);
        } else {
            res.send(result);
        }
    });
});

router.post('/asignaturas', (req, res) => {
    let sqlMax = 'SELECT IFNULL(MAX(id_asignatura), 0) AS maxId FROM TAsignaturas';
    conexion.query(sqlMax, (err, result) => {
        if (err) {
            console.log('Error al obtener último id_asignatura', err);
            return res.status(500).json({ mensaje: 'Error al generar ID' });
        }

        let nuevoId = result[0].maxId + 1;
        let data = {
            id_asignatura: nuevoId,
            nombre: req.body.nombre
        };
        let sqlInsert = 'INSERT INTO TAsignaturas SET ?';
        conexion.query(sqlInsert, data, (err, resul) => {
            if (err) {
                console.log('Error en el insert', err);
                res.status(500).json({ mensaje: 'Error al insertar' });
            } else {
                res.json({ mensaje: 'Asignatura creada', id_generado: nuevoId, data: data });
            }
        });
    });
});

router.put('/asignaturas/:id', (req, res) => {
    let id = req.params.id;
    let data = {
        nombre: req.body.nombre
    };
    let sql = 'UPDATE TAsignaturas SET ? WHERE id_asignatura = ?';
    conexion.query(sql, [data, id], (err, result) => {
        if (err) {
            console.log('Error en el update', err);
        } else {
            res.json({ mensaje: 'Asignatura actualizada correctamente' });
        }
    });
});

router.delete('/asignaturas/:id', (req, res) => {
    let id = req.params.id;
    let sql = 'DELETE FROM TAsignaturas WHERE id_asignatura = ?';
    conexion.query(sql, [id], (err, result) => {
        if (err) {
            console.log('Error al eliminar asignatura', err);
            res.status(500).json({ mensaje: 'Error al eliminar' });
        } else {
            res.json({ mensaje: 'Asignatura eliminada correctamente' });
        }
    });
});

module.exports = router;
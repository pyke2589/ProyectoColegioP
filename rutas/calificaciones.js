const express = require('express');
const router = express.Router();
const { conexion } = require('./config/conexion');

router.get('/calificaciones', (req, res) => {
    let sql = 'SELECT * FROM TCalificaciones';
    conexion.query(sql, (err, result) => {
        if (err) {
            console.log('Error en la consulta', err);
        } else {
            res.send(result);
        }
    });
});

router.post('/calificaciones', (req, res) => {
    let sqlMax = 'SELECT IFNULL(MAX(id_calificacion), 0) AS maxId FROM TCalificaciones';
    conexion.query(sqlMax, (err, result) => {
        if (err) {
            console.log('Error al obtener último id_calificacion', err);
            return res.status(500).json({ mensaje: 'Error al generar ID' });
        }

        let nuevoId = result[0].maxId + 1;
        let data = {
            id_calificacion: nuevoId,
            id_persona_estudiante: req.body.id_persona_estudiante,
            id_asignatura: req.body.id_asignatura,
            calificacion: req.body.calificacion,
            gestion: req.body.gestion
        };
        let sqlInsert = 'INSERT INTO TCalificaciones SET ?';
        conexion.query(sqlInsert, data, (err, resul) => {
            if (err) {
                console.log('Error en el insert', err);
                res.status(500).json({ mensaje: 'Error al insertar' });
            } else {
                res.json({ mensaje: 'Calificación creada', id_generado: nuevoId, data: data });
            }
        });
    });
});

router.put('/calificaciones/:id', (req, res) => {
    let id = req.params.id;
    let data = {
        id_persona_estudiante: req.body.id_persona_estudiante,
        id_asignatura: req.body.id_asignatura,
        calificacion: req.body.calificacion,
        gestion: req.body.gestion
    };
    let sql = 'UPDATE TCalificaciones SET ? WHERE id_calificacion = ?';
    conexion.query(sql, [data, id], (err, result) => {
        if (err) {
            console.log('Error en el update', err);
        } else {
            res.json({ mensaje: 'Calificación actualizada correctamente' });
        }
    });
});

router.delete('/calificaciones/:id', (req, res) => {
    let id = req.params.id;
    let sql = 'DELETE FROM TCalificaciones WHERE id_calificacion = ?';
    conexion.query(sql, [id], (err, result) => {
        if (err) {
            console.log('Error al eliminar calificación', err);
            res.status(500).json({ mensaje: 'Error al eliminar' });
        } else {
            res.json({ mensaje: 'Calificación eliminada correctamente' });
        }
    });
});

module.exports = router;
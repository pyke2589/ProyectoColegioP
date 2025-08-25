const express = require('express');
const router = express.Router();
const { conexion } = require('./config/conexion');

router.get('/asistencias', (req, res) => {
    let sql = 'SELECT * FROM TAsistencias';
    conexion.query(sql, (err, result) => {
        if (err) {
            console.log('Error en la consulta', err);
        } else {
            res.send(result);
        }
    });
});

router.post('/asistencias', (req, res) => {
    let sqlMax = 'SELECT IFNULL(MAX(id_asistencia), 0) AS maxId FROM TAsistencias';
    conexion.query(sqlMax, (err, result) => {
        if (err) {
            console.log('Error al obtener último id_asistencia', err);
            return res.status(500).json({ mensaje: 'Error al generar ID' });
        }

        let nuevoId = result[0].maxId + 1;
        let data = {
            id_asistencia: nuevoId,
            id_persona_estudiante: req.body.id_persona_estudiante,
            id_asignatura: req.body.id_asignatura,
            fecha_asistencia: req.body.fecha_asistencia,
            tipo: req.body.tipo,
            observacion: req.body.observacion || null
        };
        let sqlInsert = 'INSERT INTO TAsistencias SET ?';
        conexion.query(sqlInsert, data, (err, resul) => {
            if (err) {
                console.log('Error en el insert', err);
                res.status(500).json({ mensaje: 'Error al insertar' });
            } else {
                res.json({ mensaje: 'Asistencia creada', id_generado: nuevoId, data: data });
            }
        });
    });
});

router.put('/asistencias/:id', (req, res) => {
    let id = req.params.id;
    let data = {
        id_persona_estudiante: req.body.id_persona_estudiante,
        id_asignatura: req.body.id_asignatura,
        fecha_asistencia: req.body.fecha_asistencia,
        tipo: req.body.tipo,
        observacion: req.body.observacion || null
    };
    let sql = 'UPDATE TAsistencias SET ? WHERE id_asistencia = ?';
    conexion.query(sql, [data, id], (err, result) => {
        if (err) {
            console.log('Error en el update', err);
        } else {
            res.json({ mensaje: 'Asistencia actualizada correctamente' });
        }
    });
});

router.delete('/asistencias/:id', (req, res) => {
    let id = req.params.id;
    let sql = 'DELETE FROM TAsistencias WHERE id_asistencia = ?';
    conexion.query(sql, [id], (err, result) => {
        if (err) {
            console.log('Error al eliminar asistencia', err);
            res.status(500).json({ mensaje: 'Error al eliminar' });
        } else {
            res.json({ mensaje: 'Asistencia eliminada correctamente' });
        }
    });
});

module.exports = router;
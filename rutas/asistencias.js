const express = require('express');
const router = express.Router();
const { conexion } = require('./config/conexion');

router.get('/asistencias', (req, res) => {
    let sql = 'SELECT * FROM TAsistencias';
    req.conexion.query(sql, (err, result) => {
        if (err) {
            console.log('Error en la consulta', err);
            res.status(500).json({ mensaje: 'Error al consultar' });
        } else {
            res.send(result);
        }
    });
});

router.post('/asistencias', (req, res) => {
    let sqlMax = 'SELECT IFNULL(MAX(id_asistencia), 0) AS maxId FROM TAsistencias';
    req.conexion.query(sqlMax, (err, result) => {
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
        req.conexion.query(sqlInsert, data, (err, resul) => {
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
    req.conexion.query(sql, [data, id], (err, result) => {
        if (err) {
            console.log('Error en el update', err);
            res.status(500).json({ mensaje: 'Error al actualizar' });
        } else {
            res.json({ mensaje: 'Asistencia actualizada correctamente' });
        }
    });
});

router.delete('/asistencias/:id', (req, res) => {
    let id = req.params.id;
    let sql = 'DELETE FROM TAsistencias WHERE id_asistencia = ?';
    req.conexion.query(sql, [id], (err, result) => {
        if (err) {
            console.log('Error al eliminar asistencia', err);
            res.status(500).json({ mensaje: 'Error al eliminar' });
        } else {
            res.json({ mensaje: 'Asistencia eliminada correctamente' });
        }
    });
});

router.get('/asistencias/:id', (req, res) => {
    let id = req.params.id;
    let sql = `
        SELECT 
            a.id_asistencia,
            a.fecha_asistencia AS FechaAsistencia,
            a.tipo AS TipoAsistencia,
            COALESCE(a.observacion, '') AS Observacion,
            CONCAT(p.nombre, ' ', p.apellido1, COALESCE(' ' + p.apellido2, '')) AS NombreEstudiante,
            p.ci AS CarnetEstudiante,
            asg.nombre AS NombreAsignatura
        FROM 
            TAsistencias a
            INNER JOIN TPersonal p ON a.id_persona_estudiante = p.id_persona
            INNER JOIN TAsignaturas asg ON a.id_asignatura = asg.id_asignatura
        WHERE a.id_asistencia = ?
    `;
    req.conexion.query(sql, [id], (err, result) => {
        if (err) {
            res.json({ mensaje: 'error' });
            console.log('Error en la consulta', err);
        } else {
            res.send(result.length > 0 ? result[0] : { mensaje: 'No encontrado' });
        }
    });
});

module.exports = router;
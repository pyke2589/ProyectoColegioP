const express = require('express');
const router = express.Router();
const { conexion } = require('./config/conexion');

router.get('/calificaciones', (req, res) => {
    let sql = 'SELECT * FROM TCalificaciones';
    req.conexion.query(sql, (err, result) => {
        if (err) {
            console.log('Error en la consulta', err);
            res.status(500).json({ mensaje: 'Error al consultar' });
        } else {
            res.send(result);
        }
    });
});

router.post('/calificaciones', (req, res) => {
    let sqlMax = 'SELECT IFNULL(MAX(id_calificacion), 0) AS maxId FROM TCalificaciones';
    req.conexion.query(sqlMax, (err, result) => {
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
        req.conexion.query(sqlInsert, data, (err, resul) => {
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
    req.conexion.query(sql, [data, id], (err, result) => {
        if (err) {
            console.log('Error en el update', err);
            res.status(500).json({ mensaje: 'Error al actualizar' });
        } else {
            res.json({ mensaje: 'Calificación actualizada correctamente' });
        }
    });
});

router.delete('/calificaciones/:id', (req, res) => {
    let id = req.params.id;
    let sql = 'DELETE FROM TCalificaciones WHERE id_calificacion = ?';
    req.conexion.query(sql, [id], (err, result) => {
        if (err) {
            console.log('Error al eliminar calificación', err);
            res.status(500).json({ mensaje: 'Error al eliminar' });
        } else {
            res.json({ mensaje: 'Calificación eliminada correctamente' });
        }
    });
});

router.get('/calificaciones/:id', (req, res) => {
    let id = req.params.id;
    let sql = `
        SELECT 
            c.id_calificacion,
            c.calificacion AS Calificacion,
            c.gestion AS Gestion,
            CONCAT(p.nombre, ' ', p.apellido1, COALESCE(' ' + p.apellido2, '')) AS NombreEstudiante,
            p.ci AS CarnetEstudiante,
            a.nombre AS NombreAsignatura
        FROM 
            TCalificaciones c
            INNER JOIN TPersonal p ON c.id_persona_estudiante = p.id_persona
            INNER JOIN TAsignaturas a ON c.id_asignatura = a.id_asignatura
        WHERE c.id_calificacion = ?
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
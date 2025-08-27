const express = require('express');
const router = express.Router();
const { conexion } = require('./config/conexion');

router.get('/inscripciones', (req, res) => {
    let sql = 'SELECT * FROM TInscripciones';
    req.conexion.query(sql, (err, result) => {
        if (err) {
            console.log('Error en la consulta', err);
            res.status(500).json({ mensaje: 'Error al consultar' });
        } else {
            res.send(result);
        }
    });
});

router.post('/inscripciones', (req, res) => {
    let sqlMax = 'SELECT IFNULL(MAX(id_inscripcion), 0) AS maxId FROM TInscripciones';
    req.conexion.query(sqlMax, (err, result) => {
        if (err) {
            console.log('Error al obtener último id_inscripcion', err);
            return res.status(500).json({ mensaje: 'Error al generar ID' });
        }

        let nuevoId = result[0].maxId + 1;
        let data = {
            id_inscripcion: nuevoId,
            id_persona_estudiante: req.body.id_persona_estudiante,
            id_grado: req.body.id_grado,
            gestion: req.body.gestion,
            estado: req.body.estado || 'Activo'
        };
        let sqlInsert = 'INSERT INTO TInscripciones SET ?';
        req.conexion.query(sqlInsert, data, (err, resul) => {
            if (err) {
                console.log('Error en el insert', err);
                res.status(500).json({ mensaje: 'Error al insertar' });
            } else {
                res.json({ mensaje: 'Inscripción creada', id_generado: nuevoId, data: data });
            }
        });
    });
});

router.put('/inscripciones/:id', (req, res) => {
    let id = req.params.id;
    let data = {
        id_persona_estudiante: req.body.id_persona_estudiante,
        id_grado: req.body.id_grado,
        gestion: req.body.gestion,
        estado: req.body.estado
    };
    let sql = 'UPDATE TInscripciones SET ? WHERE id_inscripcion = ?';
    req.conexion.query(sql, [data, id], (err, result) => {
        if (err) {
            console.log('Error en el update', err);
            res.status(500).json({ mensaje: 'Error al actualizar' });
        } else {
            res.json({ mensaje: 'Inscripción actualizada correctamente' });
        }
    });
});

router.delete('/inscripciones/:id', (req, res) => {
    let id = req.params.id;
    let sql = 'DELETE FROM TInscripciones WHERE id_inscripcion = ?';
    req.conexion.query(sql, [id], (err, result) => {
        if (err) {
            console.log('Error al eliminar inscripción', err);
            res.status(500).json({ mensaje: 'Error al eliminar' });
        } else {
            res.json({ mensaje: 'Inscripción eliminada correctamente' });
        }
    });
});

router.get('/inscripciones/:id', (req, res) => {
    let id = req.params.id;
    let sql = `
        SELECT 
            i.id_inscripcion,
            i.gestion AS Gestion,
            i.fecha_inscripcion AS FechaInscripcion,
            i.estado AS Estado,
            CONCAT(p.nombre, ' ', p.apellido1, COALESCE(' ' + p.apellido2, '')) AS NombreEstudiante,
            p.ci AS CarnetEstudiante,
            g.grado AS Grado,
            g.paralelo AS Paralelo,
            g.nivel AS Nivel
        FROM 
            TInscripciones i
            INNER JOIN TPersonal p ON i.id_persona_estudiante = p.id_persona
            INNER JOIN TGrados g ON i.id_grado = g.id_grado
        WHERE i.id_inscripcion = ?
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

router.get('/inscripciones/estudiante/:id_estudiante', (req, res) => {
    let id = req.params.id_estudiante;
    let sql = `
        SELECT 
            p.nombre AS NombreEstudiante,
            p.apellido1 AS PrimerApellido,
            p.apellido2 AS SegundoApellido,
            i.gestion AS Gestion,
            g.grado AS Grado,
            g.paralelo AS Paralelo,
            g.nivel AS Nivel,
            a.nombre AS NombreAsignatura
        FROM 
            TPersonal p
            INNER JOIN TInscripciones i ON p.id_persona = i.id_persona_estudiante
            INNER JOIN TGrados g ON i.id_grado = g.id_grado
            INNER JOIN TGrados_Asignaturas ga ON g.id_grado = ga.id_grado
            INNER JOIN TAsignaturas a ON ga.id_asignatura = a.id_asignatura
        WHERE 
            p.id_persona = ? AND i.estado = 'Activo'
        ORDER BY a.nombre;
    `;
    req.conexion.query(sql, [id], (err, result) => {
        if (err) {
            res.json({ mensaje: 'error' });
            console.log('Error en la consulta', err);
        } else {
            res.send(result.length > 0 ? result : { mensaje: 'No se encontraron asignaturas para este estudiante' });
        }
    });
});

module.exports = router;
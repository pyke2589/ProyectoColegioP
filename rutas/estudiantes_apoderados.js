const express = require('express');
const router = express.Router();
const { conexion } = require('./config/conexion');

router.get('/estudiantes-apoderados', (req, res) => {
    let sql = 'SELECT * FROM TEstudiantes_Apoderados';
    req.conexion.query(sql, (err, result) => {
        if (err) {
            console.log('Error en la consulta', err);
            res.status(500).json({ mensaje: 'Error al consultar' });
        } else {
            res.send(result);
        }
    });
});

router.post('/estudiantes-apoderados', (req, res) => {
    let sqlMax = 'SELECT IFNULL(MAX(id_estudiante_apoderado), 0) AS maxId FROM TEstudiantes_Apoderados';
    req.conexion.query(sqlMax, (err, result) => {
        if (err) {
            console.log('Error al obtener último id_estudiante_apoderado', err);
            return res.status(500).json({ mensaje: 'Error al generar ID' });
        }

        let nuevoId = result[0].maxId + 1;
        let data = {
            id_estudiante_apoderado: nuevoId,
            id_estudiante: req.body.id_estudiante,
            id_apoderado: req.body.id_apoderado,
            parentesco: req.body.parentesco
        };
        let sqlInsert = 'INSERT INTO TEstudiantes_Apoderados SET ?';
        req.conexion.query(sqlInsert, data, (err, resul) => {
            if (err) {
                console.log('Error en el insert', err);
                res.status(500).json({ mensaje: 'Error al insertar' });
            } else {
                res.json({ mensaje: 'Relación creada', id_generado: nuevoId, data: data });
            }
        });
    });
});

router.put('/estudiantes-apoderados/:id', (req, res) => {
    let id = req.params.id;
    let data = {
        id_estudiante: req.body.id_estudiante,
        id_apoderado: req.body.id_apoderado,
        parentesco: req.body.parentesco
    };
    let sql = 'UPDATE TEstudiantes_Apoderados SET ? WHERE id_estudiante_apoderado = ?';
    req.conexion.query(sql, [data, id], (err, result) => {
        if (err) {
            console.log('Error en el update', err);
            res.status(500).json({ mensaje: 'Error al actualizar' });
        } else {
            res.json({ mensaje: 'Relación actualizada correctamente' });
        }
    });
});

router.delete('/estudiantes-apoderados/:id', (req, res) => {
    let id = req.params.id;
    let sql = 'DELETE FROM TEstudiantes_Apoderados WHERE id_estudiante_apoderado = ?';
    req.conexion.query(sql, [id], (err, result) => {
        if (err) {
            console.log('Error al eliminar relación', err);
            res.status(500).json({ mensaje: 'Error al eliminar' });
        } else {
            res.json({ mensaje: 'Relación eliminada correctamente' });
        }
    });
});

router.get('/estudiantes-apoderados/:id', (req, res) => {
    let id = req.params.id;
    let sql = `
        SELECT 
            ea.id_estudiante_apoderado,
            CONCAT(e.nombre, ' ', e.apellido1, COALESCE(' ' + e.apellido2, '')) AS NombreEstudiante,
            e.ci AS CarnetEstudiante,
            CONCAT(a.nombre, ' ', a.apellido1, COALESCE(' ' + a.apellido2, '')) AS NombreApoderado,
            a.ci AS CarnetApoderado,
            ea.parentesco AS Parentesco
        FROM 
            TEstudiantes_Apoderados ea
            INNER JOIN TEstudiantes e ON ea.id_estudiante = e.id_estudiante
            INNER JOIN TApoderados a ON ea.id_apoderado = a.id_apoderado
        WHERE ea.id_estudiante_apoderado = ?
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

router.get('/apoderados-con-estudiantes', (req, res) => {
    let sql = `
        SELECT 
            a.id_apoderado,
            CONCAT(a.nombre, ' ', a.apellido1, IFNULL(CONCAT(' ', a.apellido2), '')) AS NombreApoderado,
            e.id_estudiante,
            CONCAT(e.nombre, ' ', e.apellido1, IFNULL(CONCAT(' ', e.apellido2), '')) AS NombreEstudiante
        FROM 
            TEstudiantes_Apoderados ea
            INNER JOIN TApoderados a ON ea.id_apoderado = a.id_apoderado
            INNER JOIN TEstudiantes e ON ea.id_estudiante = e.id_estudiante
        ORDER BY a.id_apoderado
    `;
    req.conexion.query(sql, (err, result) => {
        if (err) {
            console.log('Error en la consulta', err);
            res.status(500).json({ mensaje: 'Error al consultar' });
        } else {
            res.send(result.length > 0 ? result : { mensaje: 'No se encontraron relaciones apoderado-estudiante' });
        }
    });
});

router.get('/estudiantes-por-apoderado/:id_apoderado', (req, res) => {
    let id_apoderado = req.params.id_apoderado;
    let sql = `
        SELECT 
            a.id_apoderado,
            CONCAT(a.nombre, ' ', a.apellido1, IFNULL(CONCAT(' ', a.apellido2), '')) AS NombreApoderado,
            e.id_estudiante,
            CONCAT(e.nombre, ' ', e.apellido1, IFNULL(CONCAT(' ', e.apellido2), '')) AS NombreEstudiante
        FROM 
            TEstudiantes_Apoderados ea
            INNER JOIN TApoderados a ON ea.id_apoderado = a.id_apoderado
            INNER JOIN TEstudiantes e ON ea.id_estudiante = e.id_estudiante
        WHERE 
            a.id_apoderado = ?
        ORDER BY e.nombre
    `;
    req.conexion.query(sql, [id_apoderado], (err, result) => {
        if (err) {
            console.log('Error en la consulta', err);
            res.status(500).json({ mensaje: 'Error al consultar' });
        } else {
            res.send(result.length > 0 ? result : { mensaje: 'No se encontraron estudiantes para este apoderado' });
        }
    });
});

module.exports = router;
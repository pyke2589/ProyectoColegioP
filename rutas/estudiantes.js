const express = require('express');
const router = express.Router();
const { conexion } = require('./config/conexion');

router.get('/estudiantes', (req, res) => {
    let sql = 'SELECT * FROM TEstudiantes';
    req.conexion.query(sql, (err, result) => {
        if (err) {
            console.log('Error en la consulta', err);
            res.status(500).json({ mensaje: 'Error al consultar' });
        } else {
            res.send(result);
        }
    });
});

router.post('/estudiantes', (req, res) => {
    let sqlMax = 'SELECT IFNULL(MAX(id_estudiante), 0) AS maxId FROM TEstudiantes';
    req.conexion.query(sqlMax, (err, result) => {
        if (err) {
            console.log('Error al obtener último id_estudiante', err);
            return res.status(500).json({ mensaje: 'Error al generar ID' });
        }

        let nuevoId = result[0].maxId + 1;
        let data = {
            id_estudiante: nuevoId,
            nombre: req.body.nombre,
            apellido1: req.body.apellido1,
            apellido2: req.body.apellido2 || null,
            fecha_nacimiento: req.body.fecha_nacimiento,
            correo: req.body.correo || null,
            direccion: req.body.direccion,
            ci: req.body.ci,
            contacto: req.body.contacto
        };
        let sqlInsert = 'INSERT INTO TEstudiantes SET ?';
        req.conexion.query(sqlInsert, data, (err, resul) => {
            if (err) {
                console.log('Error en el insert', err);
                res.status(500).json({ mensaje: 'Error al insertar' });
            } else {
                res.json({ mensaje: 'Estudiante creado', id_generado: nuevoId, data: data });
            }
        });
    });
});

router.put('/estudiantes/:id', (req, res) => {
    let id = req.params.id;
    let data = {
        nombre: req.body.nombre,
        apellido1: req.body.apellido1,
        apellido2: req.body.apellido2 || null,
        fecha_nacimiento: req.body.fecha_nacimiento,
        correo: req.body.correo || null,
        direccion: req.body.direccion,
        ci: req.body.ci,
        contacto: req.body.contacto
    };
    let sql = 'UPDATE TEstudiantes SET ? WHERE id_estudiante = ?';
    req.conexion.query(sql, [data, id], (err, result) => {
        if (err) {
            console.log('Error en el update', err);
            res.status(500).json({ mensaje: 'Error al actualizar' });
        } else {
            res.json({ mensaje: 'Estudiante actualizado correctamente' });
        }
    });
});

router.delete('/estudiantes/:id', (req, res) => {
    let id = req.params.id;
    let sql = 'DELETE FROM TEstudiantes WHERE id_estudiante = ?';
    req.conexion.query(sql, [id], (err, result) => {
        if (err) {
            console.log('Error al eliminar estudiante', err);
            res.status(500).json({ mensaje: 'Error al eliminar' });
        } else {
            res.json({ mensaje: 'Estudiante eliminado correctamente' });
        }
    });
});

router.get('/estudiantes/:id', (req, res) => {
    let id = req.params.id;
    let sql = `
        SELECT 
            e.id_estudiante,
            e.nombre AS NombreEstudiante,
            e.apellido1 AS PrimerApellido,
            COALESCE(e.apellido2, '') AS SegundoApellido,
            e.fecha_nacimiento AS FechaNacimiento,
            e.correo AS Correo,
            e.direccion AS Direccion,
            e.ci AS CarnetIdentidad,
            e.contacto AS Contacto
        FROM 
            TEstudiantes e
        WHERE e.id_estudiante = ?
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
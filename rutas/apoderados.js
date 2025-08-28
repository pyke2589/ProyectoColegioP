const express = require('express');
const router = express.Router();
const { conexion } = require('./config/conexion');

router.get('/apoderados', (req, res) => {
    let sql = 'SELECT * FROM TApoderados';
    req.conexion.query(sql, (err, result) => {
        if (err) {
            console.log('Error en la consulta', err);
            res.status(500).json({ mensaje: 'Error al consultar' });
        } else {
            res.send(result);
        }
    });
});

router.post('/apoderados', (req, res) => {
    let sqlMax = 'SELECT IFNULL(MAX(id_apoderado), 0) AS maxId FROM TApoderados';
    req.conexion.query(sqlMax, (err, result) => {
        if (err) {
            console.log('Error al obtener último id_apoderado', err);
            return res.status(500).json({ mensaje: 'Error al generar ID' });
        }

        let nuevoId = result[0].maxId + 1;
        let data = {
            id_apoderado: nuevoId,
            nombre: req.body.nombre,
            apellido1: req.body.apellido1,
            apellido2: req.body.apellido2 || null,
            correo: req.body.correo || null,
            direccion: req.body.direccion,
            ci: req.body.ci,
            contacto: req.body.contacto
        };
        let sqlInsert = 'INSERT INTO TApoderados SET ?';
        req.conexion.query(sqlInsert, data, (err, resul) => {
            if (err) {
                console.log('Error en el insert', err);
                res.status(500).json({ mensaje: 'Error al insertar' });
            } else {
                res.json({ mensaje: 'Apoderado creado', id_generado: nuevoId, data: data });
            }
        });
    });
});

router.put('/apoderados/:id', (req, res) => {
    let id = req.params.id;
    let data = {
        nombre: req.body.nombre,
        apellido1: req.body.apellido1,
        apellido2: req.body.apellido2 || null,
        correo: req.body.correo || null,
        direccion: req.body.direccion,
        ci: req.body.ci,
        contacto: req.body.contacto
    };
    let sql = 'UPDATE TApoderados SET ? WHERE id_apoderado = ?';
    req.conexion.query(sql, [data, id], (err, result) => {
        if (err) {
            console.log('Error en el update', err);
            res.status(500).json({ mensaje: 'Error al actualizar' });
        } else {
            res.json({ mensaje: 'Apoderado actualizado correctamente' });
        }
    });
});

router.delete('/apoderados/:id', (req, res) => {
    let id = req.params.id;
    let sql = 'DELETE FROM TApoderados WHERE id_apoderado = ?';
    req.conexion.query(sql, [id], (err, result) => {
        if (err) {
            console.log('Error al eliminar apoderado', err);
            res.status(500).json({ mensaje: 'Error al eliminar' });
        } else {
            res.json({ mensaje: 'Apoderado eliminado correctamente' });
        }
    });
});

router.get('/apoderados/:id', (req, res) => {
    let id = req.params.id;
    let sql = `
        SELECT 
            a.id_apoderado,
            a.nombre AS NombreApoderado,
            a.apellido1 AS PrimerApellido,
            COALESCE(a.apellido2, '') AS SegundoApellido,
            a.correo AS Correo,
            a.direccion AS Direccion,
            a.ci AS CarnetIdentidad,
            a.contacto AS Contacto
        FROM 
            TApoderados a
        WHERE a.id_apoderado = ?
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
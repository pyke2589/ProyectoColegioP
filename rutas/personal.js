const express = require('express');
const router = express.Router();
const { conexion } = require('./config/conexion');

router.get('/personal', (req, res) => {
    let sql = 'SELECT * FROM TPersonal';
    conexion.query(sql, (err, result) => {
        if (err) {
            console.log('Error en la consulta', err);
        } else {
            res.send(result);
        }
    });
});

router.post('/personal', (req, res) => {
    let sqlMax = 'SELECT IFNULL(MAX(id_persona), 0) AS maxId FROM TPersonal';
    conexion.query(sqlMax, (err, result) => {
        if (err) {
            console.log('Error al obtener último id_persona', err);
            return res.status(500).json({ mensaje: 'Error al generar ID' });
        }

        let nuevoId = result[0].maxId + 1;
        let data = {
            id_persona: nuevoId,
            tipo_persona: req.body.tipo_persona,
            id_cargo: req.body.id_cargo || null,
            nombre: req.body.nombre,
            apellido1: req.body.apellido1,
            apellido2: req.body.apellido2 || null,
            ci: req.body.ci,
            turno: req.body.turno || null,
            correo: req.body.correo || null,
            clave: req.body.clave || null,
            contacto: req.body.contacto || null,
            genero: req.body.genero || null
        };
        let sqlInsert = 'INSERT INTO TPersonal SET ?';
        conexion.query(sqlInsert, data, (err, resul) => {
            if (err) {
                console.log('Error en el insert', err);
                res.status(500).json({ mensaje: 'Error al insertar' });
            } else {
                res.json({ mensaje: 'Persona creada', id_generado: nuevoId, data: data });
            }
        });
    });
});

router.put('/personal/:id', (req, res) => {
    let id = req.params.id;
    let data = {
        tipo_persona: req.body.tipo_persona,
        id_cargo: req.body.id_cargo || null,
        nombre: req.body.nombre,
        apellido1: req.body.apellido1,
        apellido2: req.body.apellido2 || null,
        ci: req.body.ci,
        turno: req.body.turno || null,
        correo: req.body.correo || null,
        clave: req.body.clave || null,
        contacto: req.body.contacto || null,
        genero: req.body.genero || null
    };
    let sql = 'UPDATE TPersonal SET ? WHERE id_persona = ?';
    conexion.query(sql, [data, id], (err, result) => {
        if (err) {
            console.log('Error en el update', err);
        } else {
            res.json({ mensaje: 'Persona actualizada correctamente' });
        }
    });
});

router.delete('/personal/:id', (req, res) => {
    let id = req.params.id;
    let sql = 'DELETE FROM TPersonal WHERE id_persona = ?';
    conexion.query(sql, [id], (err, result) => {
        if (err) {
            console.log('Error al eliminar persona', err);
            res.status(500).json({ mensaje: 'Error al eliminar' });
        } else {
            res.json({ mensaje: 'Persona eliminada correctamente' });
        }
    });
});

module.exports = router;
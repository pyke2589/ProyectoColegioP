const express = require('express');
const router = express.Router();
const { conexion } = require('./config/conexion');

router.get('/persona-relacion', (req, res) => {
    let sql = 'SELECT * FROM TPersona_Relacion';
    conexion.query(sql, (err, result) => {
        if (err) {
            console.log('Error en la consulta', err);
        } else {
            res.send(result);
        }
    });
});

router.post('/persona-relacion', (req, res) => {
    let sqlMax = 'SELECT IFNULL(MAX(id_relacion), 0) AS maxId FROM TPersona_Relacion';
    conexion.query(sqlMax, (err, result) => {
        if (err) {
            console.log('Error al obtener último id_relacion', err);
            return res.status(500).json({ mensaje: 'Error al generar ID' });
        }

        let nuevoId = result[0].maxId + 1;
        let data = {
            id_relacion: nuevoId,
            id_persona_estudiante: req.body.id_persona_estudiante,
            id_persona_apoderado: req.body.id_persona_apoderado,
            tipo_relacion: req.body.tipo_relacion
        };
        let sqlInsert = 'INSERT INTO TPersona_Relacion SET ?';
        conexion.query(sqlInsert, data, (err, resul) => {
            if (err) {
                console.log('Error en el insert', err);
                res.status(500).json({ mensaje: 'Error al insertar' });
            } else {
                res.json({ mensaje: 'Relación creada', id_generado: nuevoId, data: data });
            }
        });
    });
});

router.put('/persona-relacion/:id', (req, res) => {
    let id = req.params.id;
    let data = {
        id_persona_estudiante: req.body.id_persona_estudiante,
        id_persona_apoderado: req.body.id_persona_apoderado,
        tipo_relacion: req.body.tipo_relacion
    };
    let sql = 'UPDATE TPersona_Relacion SET ? WHERE id_relacion = ?';
    conexion.query(sql, [data, id], (err, result) => {
        if (err) {
            console.log('Error en el update', err);
        } else {
            res.json({ mensaje: 'Relación actualizada correctamente' });
        }
    });
});

router.delete('/persona-relacion/:id', (req, res) => {
    let id = req.params.id;
    let sql = 'DELETE FROM TPersona_Relacion WHERE id_relacion = ?';
    conexion.query(sql, [id], (err, result) => {
        if (err) {
            console.log('Error al eliminar relación', err);
            res.status(500).json({ mensaje: 'Error al eliminar' });
        } else {
            res.json({ mensaje: 'Relación eliminada correctamente' });
        }
    });
});

module.exports = router;
const express = require('express');
const router = express.Router();
const { conexion } = require('./config/conexion');

router.get('/asistencias-personal', (req, res) => {
    let sql = 'SELECT * FROM TAsistencias_Personal';
    req.conexion.query(sql, (err, result) => {
        if (err) {
            console.log('Error en la consulta', err);
            res.status(500).json({ mensaje: 'Error al consultar' });
        } else {
            res.send(result);
        }
    });
});

router.post('/asistencias-personal', (req, res) => {
    let sqlMax = 'SELECT IFNULL(MAX(id_asistencia), 0) AS maxId FROM TAsistencias_Personal';
    req.conexion.query(sqlMax, (err, result) => {
        if (err) {
            console.log('Error al obtener último id_asistencia', err);
            return res.status(500).json({ mensaje: 'Error al generar ID' });
        }

        let nuevoId = result[0].maxId + 1;
        let data = {
            id_asistencia: nuevoId,
            id_personal: req.body.id_personal,
            fecha_asistencia: req.body.fecha_asistencia || new Date(),
            observacion: req.body.observacion || null,
            tipo: req.body.tipo
        };
        let sqlInsert = 'INSERT INTO TAsistencias_Personal SET ?';
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

router.put('/asistencias-personal/:id', (req, res) => {
    let id = req.params.id;
    let data = {
        id_personal: req.body.id_personal,
        fecha_asistencia: req.body.fecha_asistencia || new Date(),
        observacion: req.body.observacion || null,
        tipo: req.body.tipo
    };
    let sql = 'UPDATE TAsistencias_Personal SET ? WHERE id_asistencia = ?';
    req.conexion.query(sql, [data, id], (err, result) => {
        if (err) {
            console.log('Error en el update', err);
            res.status(500).json({ mensaje: 'Error al actualizar' });
        } else {
            res.json({ mensaje: 'Asistencia actualizada correctamente' });
        }
    });
});

router.delete('/asistencias-personal/:id', (req, res) => {
    let id = req.params.id;
    let sql = 'DELETE FROM TAsistencias_Personal WHERE id_asistencia = ?';
    req.conexion.query(sql, [id], (err, result) => {
        if (err) {
            console.log('Error al eliminar asistencia', err);
            res.status(500).json({ mensaje: 'Error al eliminar' });
        } else {
            res.json({ mensaje: 'Asistencia eliminada correctamente' });
        }
    });
});

router.get('/asistencias-personal/:id', (req, res) => {
    let id = req.params.id;
    let sql = `
        SELECT 
            ap.id_asistencia,
            ap.fecha_asistencia AS FechaAsistencia,
            ap.tipo AS TipoAsistencia,
            COALESCE(ap.observacion, '') AS Observacion,
            CONCAT(p.nombre, ' ', p.apellido1, COALESCE(' ' + p.apellido2, '')) AS NombrePersonal,
            p.ci AS CarnetPersonal
        FROM 
            TAsistencias_Personal ap
            INNER JOIN TPersonal p ON ap.id_personal = p.id_personal
        WHERE ap.id_asistencia = ?
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
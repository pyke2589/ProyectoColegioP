const express = require('express');
const router = express.Router();
const { conexion } = require('./config/conexion');

router.get('/pagos', (req, res) => {
    let sql = 'SELECT * FROM TPagos';
    req.conexion.query(sql, (err, result) => {
        if (err) {
            console.log('Error en la consulta', err);
            res.status(500).json({ mensaje: 'Error al consultar' });
        } else {
            res.send(result);
        }
    });
});

router.post('/pagos', (req, res) => {
    let sqlMax = 'SELECT IFNULL(MAX(id_pago), 0) AS maxId FROM TPagos';
    req.conexion.query(sqlMax, (err, result) => {
        if (err) {
            console.log('Error al obtener último id_pago', err);
            return res.status(500).json({ mensaje: 'Error al generar ID' });
        }

        let nuevoId = result[0].maxId + 1;
        let data = {
            id_pago: nuevoId,
            id_inscripcion: req.body.id_inscripcion,
            monto: req.body.monto,
            fecha_pago: req.body.fecha_pago,
            concepto: req.body.concepto
        };
        let sqlInsert = 'INSERT INTO TPagos SET ?';
        req.conexion.query(sqlInsert, data, (err, resul) => {
            if (err) {
                console.log('Error en el insert', err);
                res.status(500).json({ mensaje: 'Error al insertar' });
            } else {
                res.json({ mensaje: 'Pago creado', id_generado: nuevoId, data: data });
            }
        });
    });
});

router.put('/pagos/:id', (req, res) => {
    let id = req.params.id;
    let data = {
        id_inscripcion: req.body.id_inscripcion,
        monto: req.body.monto,
        fecha_pago: req.body.fecha_pago,
        concepto: req.body.concepto
    };
    let sql = 'UPDATE TPagos SET ? WHERE id_pago = ?';
    req.conexion.query(sql, [data, id], (err, result) => {
        if (err) {
            console.log('Error en el update', err);
            res.status(500).json({ mensaje: 'Error al actualizar' });
        } else {
            res.json({ mensaje: 'Pago actualizado correctamente' });
        }
    });
});

router.delete('/pagos/:id', (req, res) => {
    let id = req.params.id;
    let sql = 'DELETE FROM TPagos WHERE id_pago = ?';
    req.conexion.query(sql, [id], (err, result) => {
        if (err) {
            console.log('Error al eliminar pago', err);
            res.status(500).json({ mensaje: 'Error al eliminar' });
        } else {
            res.json({ mensaje: 'Pago eliminado correctamente' });
        }
    });
});

router.get('/pagos/:id', (req, res) => {
    let id = req.params.id;
    let sql = `
        SELECT 
            p.id_pago,
            p.monto AS Monto,
            p.fecha_pago AS FechaPago,
            p.concepto AS Concepto,
            CONCAT(pe.nombre, ' ', pe.apellido1, COALESCE(' ' + pe.apellido2, '')) AS NombreEstudiante,
            pe.ci AS CarnetEstudiante,
            g.grado AS Grado,
            g.paralelo AS Paralelo
        FROM 
            TPagos p
            INNER JOIN TInscripciones i ON p.id_inscripcion = i.id_inscripcion
            INNER JOIN TPersonal pe ON i.id_persona_estudiante = pe.id_persona
            INNER JOIN TGrados g ON i.id_grado = g.id_grado
        WHERE p.id_pago = ?
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
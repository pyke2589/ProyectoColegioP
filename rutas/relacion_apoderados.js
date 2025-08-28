const express = require('express');
const router = express.Router();
const { conexion } = require('./config/conexion');

router.get('/relacion-apoderados', (req, res) => {
    let sql = 'SELECT * FROM TRelacion_Apoderados';
    req.conexion.query(sql, (err, result) => {
        if (err) {
            console.log('Error en la consulta', err);
            res.status(500).json({ mensaje: 'Error al consultar' });
        } else {
            res.send(result);
        }
    });
});

router.post('/relacion-apoderados', (req, res) => {
    let sqlMax = 'SELECT IFNULL(MAX(id_relacion), 0) AS maxId FROM TRelacion_Apoderados';
    req.conexion.query(sqlMax, (err, result) => {
        if (err) {
            console.log('Error al obtener último id_relacion', err);
            return res.status(500).json({ mensaje: 'Error al generar ID' });
        }

        let nuevoId = result[0].maxId + 1;
        let data = {
            id_relacion: nuevoId,
            nombre: req.body.nombre
        };
        let sqlInsert = 'INSERT INTO TRelacion_Apoderados SET ?';
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

router.put('/relacion-apoderados/:id', (req, res) => {
    let id = req.params.id;
    let data = {
        nombre: req.body.nombre
    };
    let sql = 'UPDATE TRelacion_Apoderados SET ? WHERE id_relacion = ?';
    req.conexion.query(sql, [data, id], (err, result) => {
        if (err) {
            console.log('Error en el update', err);
            res.status(500).json({ mensaje: 'Error al actualizar' });
        } else {
            res.json({ mensaje: 'Relación actualizada correctamente' });
        }
    });
});

router.delete('/relacion-apoderados/:id', (req, res) => {
    let id = req.params.id;
    let sql = 'DELETE FROM TRelacion_Apoderados WHERE id_relacion = ?';
    req.conexion.query(sql, [id], (err, result) => {
        if (err) {
            console.log('Error al eliminar relación', err);
            res.status(500).json({ mensaje: 'Error al eliminar' });
        } else {
            res.json({ mensaje: 'Relación eliminada correctamente' });
        }
    });
});

router.get('/relacion-apoderados/:id', (req, res) => {
    let id = req.params.id;
    let sql = `
        SELECT 
            r.id_relacion,
            r.nombre AS NombreRelacion
        FROM 
            TRelacion_Apoderados r
        WHERE r.id_relacion = ?
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
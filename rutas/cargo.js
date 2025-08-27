const express = require('express');
const router = express.Router();
const { conexion } = require('./config/conexion');

router.get('/cargo', (req, res) => {
    let sql = 'SELECT * FROM TCargo';
    req.conexion.query(sql, (err, result) => {
        if (err) {
            console.log('Error en la consulta', err);
            res.status(500).json({ mensaje: 'Error al consultar' });
        } else {
            res.send(result);
        }
    });
});

router.post('/cargo', (req, res) => {
    let sqlMax = 'SELECT IFNULL(MAX(id_cargo), 0) AS maxId FROM TCargo';
    req.conexion.query(sqlMax, (err, result) => {
        if (err) {
            console.log('Error al obtener último id_cargo', err);
            return res.status(500).json({ mensaje: 'Error al generar ID' });
        }

        let nuevoId = result[0].maxId + 1;
        let data = {
            id_cargo: nuevoId,
            nombre: req.body.nombre,
            sueldo_base: req.body.sueldo_base
        };
        let sqlInsert = 'INSERT INTO TCargo SET ?';
        req.conexion.query(sqlInsert, data, (err, resul) => {
            if (err) {
                console.log('Error en el insert', err);
                res.status(500).json({ mensaje: 'Error al insertar' });
            } else {
                res.json({ mensaje: 'Cargo creado', id_generado: nuevoId, data: data });
            }
        });
    });
});

router.put('/cargo/:id', (req, res) => {
    let id = req.params.id;
    let data = {
        nombre: req.body.nombre,
        sueldo_base: req.body.sueldo_base
    };
    let sql = 'UPDATE TCargo SET ? WHERE id_cargo = ?';
    req.conexion.query(sql, [data, id], (err, result) => {
        if (err) {
            console.log('Error en el update', err);
            res.status(500).json({ mensaje: 'Error al actualizar' });
        } else {
            res.json({ mensaje: 'Cargo actualizado correctamente' });
        }
    });
});

router.delete('/cargo/:id', (req, res) => {
    let id = req.params.id;
    let sql = 'DELETE FROM TCargo WHERE id_cargo = ?';
    req.conexion.query(sql, [id], (err, result) => {
        if (err) {
            console.log('Error al eliminar cargo', err);
            res.status(500).json({ mensaje: 'Error al eliminar' });
        } else {
            res.json({ mensaje: 'Cargo eliminado correctamente' });
        }
    });
});

router.get('/cargo/:id', (req, res) => {
    let id = req.params.id;
    let sql = `
        SELECT 
            c.id_cargo,
            c.nombre AS NombreCargo,
            c.sueldo_base AS SueldoBase
        FROM 
            TCargo c
        WHERE c.id_cargo = ?
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
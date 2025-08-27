const express = require('express');
const router = express.Router();
const { conexion } = require('./config/conexion');

router.get('/aulas', (req, res) => {
    let sql = 'SELECT * FROM TAulas';
    req.conexion.query(sql, (err, result) => {
        if (err) {
            console.log('Error en la consulta', err);
            res.status(500).json({ mensaje: 'Error al consultar' });
        } else {
            res.send(result);
        }
    });
});

router.post('/aulas', (req, res) => {
    let sqlMax = 'SELECT IFNULL(MAX(id_aula), 0) AS maxId FROM TAulas';
    req.conexion.query(sqlMax, (err, result) => {
        if (err) {
            console.log('Error al obtener último id_aula', err);
            return res.status(500).json({ mensaje: 'Error al generar ID' });
        }

        let nuevoId = result[0].maxId + 1;
        let data = {
            id_aula: nuevoId,
            nombre: req.body.nombre,
            ubicacion: req.body.ubicacion || null,
            tipo_aula: req.body.tipo_aula,
            capacidad: req.body.capacidad
        };
        let sqlInsert = 'INSERT INTO TAulas SET ?';
        req.conexion.query(sqlInsert, data, (err, resul) => {
            if (err) {
                console.log('Error en el insert', err);
                res.status(500).json({ mensaje: 'Error al insertar' });
            } else {
                res.json({ mensaje: 'Aula creada', id_generado: nuevoId, data: data });
            }
        });
    });
});

router.put('/aulas/:id', (req, res) => {
    let id = req.params.id;
    let data = {
        nombre: req.body.nombre,
        ubicacion: req.body.ubicacion || null,
        tipo_aula: req.body.tipo_aula,
        capacidad: req.body.capacidad
    };
    let sql = 'UPDATE TAulas SET ? WHERE id_aula = ?';
    req.conexion.query(sql, [data, id], (err, result) => {
        if (err) {
            console.log('Error en el update', err);
            res.status(500).json({ mensaje: 'Error al actualizar' });
        } else {
            res.json({ mensaje: 'Aula actualizada correctamente' });
        }
    });
});

router.delete('/aulas/:id', (req, res) => {
    let id = req.params.id;
    let sql = 'DELETE FROM TAulas WHERE id_aula = ?';
    req.conexion.query(sql, [id], (err, result) => {
        if (err) {
            console.log('Error al eliminar aula', err);
            res.status(500).json({ mensaje: 'Error al eliminar' });
        } else {
            res.json({ mensaje: 'Aula eliminada correctamente' });
        }
    });
});

router.get('/aulas/:id', (req, res) => {
    let id = req.params.id;
    let sql = `
        SELECT 
            a.id_aula,
            a.nombre AS NombreAula,
            a.ubicacion AS Ubicacion,
            a.tipo_aula AS TipoAula,
            a.capacidad AS Capacidad
        FROM 
            TAulas a
        WHERE a.id_aula = ?
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
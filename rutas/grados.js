const express = require('express');
const router = express.Router();
const { conexion } = require('./config/conexion');

router.get('/grados', (req, res) => {
    let sql = 'SELECT * FROM TGrados';
    conexion.query(sql, (err, result) => {
        if (err) {
            console.log('Error en la consulta', err);
        } else {
            res.send(result);
        }
    });
});

router.post('/grados', (req, res) => {
    let sqlMax = 'SELECT IFNULL(MAX(id_grado), 0) AS maxId FROM TGrados';
    conexion.query(sqlMax, (err, result) => {
        if (err) {
            console.log('Error al obtener último id_grado', err);
            return res.status(500).json({ mensaje: 'Error al generar ID' });
        }

        let nuevoId = result[0].maxId + 1;
        let data = {
            id_grado: nuevoId,
            id_aula: req.body.id_aula,
            nivel: req.body.nivel,
            grado: req.body.grado,
            paralelo: req.body.paralelo,
            capacidad: req.body.capacidad
        };
        let sqlInsert = 'INSERT INTO TGrados SET ?';
        conexion.query(sqlInsert, data, (err, resul) => {
            if (err) {
                console.log('Error en el insert', err);
                res.status(500).json({ mensaje: 'Error al insertar' });
            } else {
                res.json({ mensaje: 'Grado creado', id_generado: nuevoId, data: data });
            }
        });
    });
});

router.put('/grados/:id', (req, res) => {
    let id = req.params.id;
    let data = {
        id_aula: req.body.id_aula,
        nivel: req.body.nivel,
        grado: req.body.grado,
        paralelo: req.body.paralelo,
        capacidad: req.body.capacidad
    };
    let sql = 'UPDATE TGrados SET ? WHERE id_grado = ?';
    conexion.query(sql, [data, id], (err, result) => {
        if (err) {
            console.log('Error en el update', err);
        } else {
            res.json({ mensaje: 'Grado actualizado correctamente' });
        }
    });
});

router.delete('/grados/:id', (req, res) => {
    let id = req.params.id;
    let sql = 'DELETE FROM TGrados WHERE id_grado = ?';
    conexion.query(sql, [id], (err, result) => {
        if (err) {
            console.log('Error al eliminar grado', err);
            res.status(500).json({ mensaje: 'Error al eliminar' });
        } else {
            res.json({ mensaje: 'Grado eliminado correctamente' });
        }
    });
});

module.exports = router;
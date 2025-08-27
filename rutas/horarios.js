const express = require('express');
const router = express.Router();
const { conexion } = require('./config/conexion');

router.get('/horarios', (req, res) => {
    let sql = 'SELECT * FROM THorarios';
    req.conexion.query(sql, (err, result) => {
        if (err) {
            console.log('Error en la consulta', err);
            res.status(500).json({ mensaje: 'Error al consultar' });
        } else {
            res.send(result);
        }
    });
});

router.post('/horarios', (req, res) => {
    let sqlMax = 'SELECT IFNULL(MAX(id_horario), 0) AS maxId FROM THorarios';
    req.conexion.query(sqlMax, (err, result) => {
        if (err) {
            console.log('Error al obtener último id_horario', err);
            return res.status(500).json({ mensaje: 'Error al generar ID' });
        }

        let nuevoId = result[0].maxId + 1;
        let data = {
            id_horario: nuevoId,
            turno: req.body.turno,
            hora_inicio: req.body.hora_inicio,
            hora_fin: req.body.hora_fin,
            dia_semana: req.body.dia_semana
        };
        let sqlInsert = 'INSERT INTO THorarios SET ?';
        req.conexion.query(sqlInsert, data, (err, resul) => {
            if (err) {
                console.log('Error en el insert', err);
                res.status(500).json({ mensaje: 'Error al insertar' });
            } else {
                res.json({ mensaje: 'Horario creado', id_generado: nuevoId, data: data });
            }
        });
    });
});

router.put('/horarios/:id', (req, res) => {
    let id = req.params.id;
    let data = {
        turno: req.body.turno,
        hora_inicio: req.body.hora_inicio,
        hora_fin: req.body.hora_fin,
        dia_semana: req.body.dia_semana
    };
    let sql = 'UPDATE THorarios SET ? WHERE id_horario = ?';
    req.conexion.query(sql, [data, id], (err, result) => {
        if (err) {
            console.log('Error en el update', err);
            res.status(500).json({ mensaje: 'Error al actualizar' });
        } else {
            res.json({ mensaje: 'Horario actualizado correctamente' });
        }
    });
});

router.delete('/horarios/:id', (req, res) => {
    let id = req.params.id;
    let sql = 'DELETE FROM THorarios WHERE id_horario = ?';
    req.conexion.query(sql, [id], (err, result) => {
        if (err) {
            console.log('Error al eliminar horario', err);
            res.status(500).json({ mensaje: 'Error al eliminar' });
        } else {
            res.json({ mensaje: 'Horario eliminado correctamente' });
        }
    });
});

router.get('/horarios/:id', (req, res) => {
    let id = req.params.id;
    let sql = `
        SELECT 
            h.id_horario,
            h.turno AS Turno,
            h.hora_inicio AS HoraInicio,
            h.hora_fin AS HoraFin,
            h.dia_semana AS DiaSemana
        FROM 
            THorarios h
        WHERE h.id_horario = ?
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
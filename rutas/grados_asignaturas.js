const express = require('express');
const router = express.Router();
const { conexion } = require('./config/conexion');

router.get('/grados-asignaturas', (req, res) => {
    let sql = 'SELECT * FROM TGrados_Asignaturas';
    req.conexion.query(sql, (err, result) => {
        if (err) {
            console.log('Error en la consulta', err);
            res.status(500).json({ mensaje: 'Error al consultar' });
        } else {
            res.send(result);
        }
    });
});

router.post('/grados-asignaturas', (req, res) => {
    let sqlMax = 'SELECT IFNULL(MAX(id_grado_asignatura), 0) AS maxId FROM TGrados_Asignaturas';
    req.conexion.query(sqlMax, (err, result) => {
        if (err) {
            console.log('Error al obtener último id_grado_asignatura', err);
            return res.status(500).json({ mensaje: 'Error al generar ID' });
        }

        let nuevoId = result[0].maxId + 1;
        let data = {
            id_grado_asignatura: nuevoId,
            id_grado: req.body.id_grado,
            id_asignatura: req.body.id_asignatura,
            id_horario: req.body.id_horario
        };
        let sqlInsert = 'INSERT INTO TGrados_Asignaturas SET ?';
        req.conexion.query(sqlInsert, data, (err, resul) => {
            if (err) {
                console.log('Error en el insert', err);
                res.status(500).json({ mensaje: 'Error al insertar' });
            } else {
                res.json({ mensaje: 'Grado-Asignatura creado', id_generado: nuevoId, data: data });
            }
        });
    });
});

router.put('/grados-asignaturas/:id', (req, res) => {
    let id = req.params.id;
    let data = {
        id_grado: req.body.id_grado,
        id_asignatura: req.body.id_asignatura,
        id_horario: req.body.id_horario
    };
    let sql = 'UPDATE TGrados_Asignaturas SET ? WHERE id_grado_asignatura = ?';
    req.conexion.query(sql, [data, id], (err, result) => {
        if (err) {
            console.log('Error en el update', err);
            res.status(500).json({ mensaje: 'Error al actualizar' });
        } else {
            res.json({ mensaje: 'Grado-Asignatura actualizado correctamente' });
        }
    });
});

router.delete('/grados-asignaturas/:id', (req, res) => {
    let id = req.params.id;
    let sql = 'DELETE FROM TGrados_Asignaturas WHERE id_grado_asignatura = ?';
    req.conexion.query(sql, [id], (err, result) => {
        if (err) {
            console.log('Error al eliminar grado-asignatura', err);
            res.status(500).json({ mensaje: 'Error al eliminar' });
        } else {
            res.json({ mensaje: 'Grado-Asignatura eliminado correctamente' });
        }
    });
});

router.get('/grados-asignaturas/:id', (req, res) => {
    let id = req.params.id;
    let sql = `
        SELECT 
            ga.id_grado_asignatura,
            g.grado AS Grado,
            g.paralelo AS Paralelo,
            g.nivel AS Nivel,
            a.nombre AS NombreAsignatura,
            h.turno AS Turno,
            h.hora_inicio AS HoraInicio,
            h.hora_fin AS HoraFin,
            h.dia_semana AS DiaSemana
        FROM 
            TGrados_Asignaturas ga
            INNER JOIN TGrados g ON ga.id_grado = g.id_grado
            INNER JOIN TAsignaturas a ON ga.id_asignatura = a.id_asignatura
            INNER JOIN THorarios h ON ga.id_horario = h.id_horario
        WHERE ga.id_grado_asignatura = ?
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
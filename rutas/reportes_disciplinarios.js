const express = require('express');
const router = express.Router();
const { conexion } = require('./config/conexion');

router.get('/reportes-disciplinarios', (req, res) => {
    let sql = 'SELECT * FROM TReportes_Disciplinarios';
    conexion.query(sql, (err, result) => {
        if (err) {
            console.log('Error en la consulta', err);
        } else {
            res.send(result);
        }
    });
});

router.post('/reportes-disciplinarios', (req, res) => {
    let sqlMax = 'SELECT IFNULL(MAX(id_reporte_disciplinario), 0) AS maxId FROM TReportes_Disciplinarios';
    conexion.query(sqlMax, (err, result) => {
        if (err) {
            console.log('Error al obtener último id_reporte_disciplinario', err);
            return res.status(500).json({ mensaje: 'Error al generar ID' });
        }

        let nuevoId = result[0].maxId + 1;
        let data = {
            id_reporte_disciplinario: nuevoId,
            id_persona_estudiante: req.body.id_persona_estudiante,
            id_persona_docente: req.body.id_persona_docente,
            fecha_reporte: req.body.fecha_reporte,
            descripcion: req.body.descripcion,
            sancion: req.body.sancion || null
        };
        let sqlInsert = 'INSERT INTO TReportes_Disciplinarios SET ?';
        conexion.query(sqlInsert, data, (err, resul) => {
            if (err) {
                console.log('Error en el insert', err);
                res.status(500).json({ mensaje: 'Error al insertar' });
            } else {
                res.json({ mensaje: 'Reporte creado', id_generado: nuevoId, data: data });
            }
        });
    });
});

router.put('/reportes-disciplinarios/:id', (req, res) => {
    let id = req.params.id;
    let data = {
        id_persona_estudiante: req.body.id_persona_estudiante,
        id_persona_docente: req.body.id_persona_docente,
        fecha_reporte: req.body.fecha_reporte,
        descripcion: req.body.descripcion,
        sancion: req.body.sancion || null
    };
    let sql = 'UPDATE TReportes_Disciplinarios SET ? WHERE id_reporte_disciplinario = ?';
    conexion.query(sql, [data, id], (err, result) => {
        if (err) {
            console.log('Error en el update', err);
        } else {
            res.json({ mensaje: 'Reporte actualizado correctamente' });
        }
    });
});

router.delete('/reportes-disciplinarios/:id', (req, res) => {
    let id = req.params.id;
    let sql = 'DELETE FROM TReportes_Disciplinarios WHERE id_reporte_disciplinario = ?';
    conexion.query(sql, [id], (err, result) => {
        if (err) {
            console.log('Error al eliminar reporte', err);
            res.status(500).json({ mensaje: 'Error al eliminar' });
        } else {
            res.json({ mensaje: 'Reporte eliminado correctamente' });
        }
    });
});

module.exports = router;
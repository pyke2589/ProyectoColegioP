const express = require('express');
const router = express.Router();
const { conexion } = require('./config/conexion');

// GET todos los reportes disciplinarios
router.get('/reportes-disciplinarios', (req, res) => {
    let sql = 'SELECT * FROM TReportes_Disciplinarios';
    req.conexion.query(sql, (err, result) => {
        if (err) {
            console.log('Error en la consulta', err);
            res.status(500).json({ mensaje: 'Error al consultar' });
        } else {
            res.send(result);
        }
    });
});

// POST crear reporte disciplinario
router.post('/reportes-disciplinarios', (req, res) => {
    let sqlMax = 'SELECT IFNULL(MAX(id_reporte_disciplinario), 0) AS maxId FROM TReportes_Disciplinarios';
    req.conexion.query(sqlMax, (err, result) => {
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
        req.conexion.query(sqlInsert, data, (err, resul) => {
            if (err) {
                console.log('Error en el insert', err);
                res.status(500).json({ mensaje: 'Error al insertar' });
            } else {
                res.json({ mensaje: 'Reporte creado', id_generado: nuevoId, data: data });
            }
        });
    });
});

// PUT actualizar reporte disciplinario
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
    req.conexion.query(sql, [data, id], (err, result) => {
        if (err) {
            console.log('Error en el update', err);
            res.status(500).json({ mensaje: 'Error al actualizar' });
        } else {
            res.json({ mensaje: 'Reporte actualizado correctamente' });
        }
    });
});

// DELETE eliminar reporte disciplinario
router.delete('/reportes-disciplinarios/:id', (req, res) => {
    let id = req.params.id;
    let sql = 'DELETE FROM TReportes_Disciplinarios WHERE id_reporte_disciplinario = ?';
    req.conexion.query(sql, [id], (err, result) => {
        if (err) {
            console.log('Error al eliminar reporte', err);
            res.status(500).json({ mensaje: 'Error al eliminar' });
        } else {
            res.json({ mensaje: 'Reporte eliminado correctamente' });
        }
    });
});

// GET reporte disciplinario por ID con información relacionada
router.get('/reportes-disciplinarios/:id', (req, res) => {
    let id = req.params.id;
    let sql = `
        SELECT 
            rd.id_reporte_disciplinario,
            rd.fecha_reporte AS FechaReporte,
            rd.descripcion AS Descripcion,
            COALESCE(rd.sancion, '') AS Sancion,
            CONCAT(pe.nombre, ' ', pe.apellido1, COALESCE(' ' + pe.apellido2, '')) AS NombreEstudiante,
            pe.ci AS CarnetEstudiante,
            CONCAT(pd.nombre, ' ', pd.apellido1, COALESCE(' ' + pd.apellido2, '')) AS NombreDocente,
            pd.ci AS CarnetDocente
        FROM 
            TReportes_Disciplinarios rd
            INNER JOIN TPersonal pe ON rd.id_persona_estudiante = pe.id_persona
            INNER JOIN TPersonal pd ON rd.id_persona_docente = pd.id_persona
        WHERE rd.id_reporte_disciplinario = ?
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
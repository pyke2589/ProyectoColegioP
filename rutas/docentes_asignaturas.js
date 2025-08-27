const express = require('express');
const router = express.Router();
const { conexion } = require('./config/conexion');

router.get('/docentes-asignaturas', (req, res) => {
    let sql = 'SELECT * FROM TDocentes_Asignaturas';
    req.conexion.query(sql, (err, result) => {
        if (err) {
            console.log('Error en la consulta', err);
            res.status(500).json({ mensaje: 'Error al consultar' });
        } else {
            res.send(result);
        }
    });
});
router.post('/docentes-asignaturas', (req, res) => {
    let sqlMax = 'SELECT IFNULL(MAX(id_docente_asignatura), 0) AS maxId FROM TDocentes_Asignaturas';
    req.conexion.query(sqlMax, (err, result) => {
        if (err) {
            console.log('Error al obtener último id_docente_asignatura', err);
            return res.status(500).json({ mensaje: 'Error al generar ID' });
        }

        let nuevoId = result[0].maxId + 1;
        let data = {
            id_docente_asignatura: nuevoId,
            id_persona_docente: req.body.id_persona_docente,
            id_grado_asignatura: req.body.id_grado_asignatura
        };
        let sqlInsert = 'INSERT INTO TDocentes_Asignaturas SET ?';
        req.conexion.query(sqlInsert, data, (err, resul) => {
            if (err) {
                console.log('Error en el insert', err);
                res.status(500).json({ mensaje: 'Error al insertar' });
            } else {
                res.json({ mensaje: 'Docente-Asignatura creado', id_generado: nuevoId, data: data });
            }
        });
    });
});

router.put('/docentes-asignaturas/:id', (req, res) => {
    let id = req.params.id;
    let data = {
        id_persona_docente: req.body.id_persona_docente,
        id_grado_asignatura: req.body.id_grado_asignatura
    };
    let sql = 'UPDATE TDocentes_Asignaturas SET ? WHERE id_docente_asignatura = ?';
    req.conexion.query(sql, [data, id], (err, result) => {
        if (err) {
            console.log('Error en el update', err);
            res.status(500).json({ mensaje: 'Error al actualizar' });
        } else {
            res.json({ mensaje: 'Docente-Asignatura actualizado correctamente' });
        }
    });
});

router.delete('/docentes-asignaturas/:id', (req, res) => {
    let id = req.params.id;
    let sql = 'DELETE FROM TDocentes_Asignaturas WHERE id_docente_asignatura = ?';
    req.conexion.query(sql, [id], (err, result) => {
        if (err) {
            console.log('Error al eliminar docente-asignatura', err);
            res.status(500).json({ mensaje: 'Error al eliminar' });
        } else {
            res.json({ mensaje: 'Docente-Asignatura eliminado correctamente' });
        }
    });
});

router.get('/docentes-asignaturas/:id', (req, res) => {
    let id = req.params.id;
    let sql = `
        SELECT 
            da.id_docente_asignatura,
            CONCAT(p.nombre, ' ', p.apellido1, COALESCE(' ' + p.apellido2, '')) AS NombreDocente,
            p.ci AS CarnetDocente,
            g.grado AS Grado,
            g.paralelo AS Paralelo,
            a.nombre AS NombreAsignatura,
            h.turno AS Turno,
            h.dia_semana AS DiaSemana
        FROM 
            TDocentes_Asignaturas da
            INNER JOIN TPersonal p ON da.id_persona_docente = p.id_persona
            INNER JOIN TGrados_Asignaturas ga ON da.id_grado_asignatura = ga.id_grado_asignatura
            INNER JOIN TGrados g ON ga.id_grado = g.id_grado
            INNER JOIN TAsignaturas a ON ga.id_asignatura = a.id_asignatura
            INNER JOIN THorarios h ON ga.id_horario = h.id_horario
        WHERE da.id_docente_asignatura = ?
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

router.get('/docentes-asignaturas/docente/:id_docente', (req, res) => {
    let id = req.params.id_docente;
    let sql = `
        SELECT 
            p.nombre AS NombreDocente,
            p.apellido1 AS PrimerApellido,
            p.apellido2 AS SegundoApellido,
            g.grado AS Grado,
            g.paralelo AS Paralelo,
            g.nivel AS Nivel,
            a.nombre AS NombreAsignatura,
            h.turno AS Turno,
            h.dia_semana AS DiaSemana,
            h.hora_inicio AS HoraInicio,
            h.hora_fin AS HoraFin
        FROM 
            TPersonal p
            INNER JOIN TDocentes_Asignaturas da ON p.id_persona = da.id_persona_docente
            INNER JOIN TGrados_Asignaturas ga ON da.id_grado_asignatura = ga.id_grado_asignatura
            INNER JOIN TGrados g ON ga.id_grado = g.id_grado
            INNER JOIN TAsignaturas a ON ga.id_asignatura = a.id_asignatura
            INNER JOIN THorarios h ON ga.id_horario = h.id_horario
        WHERE 
            p.id_persona = ? AND p.tipo_persona = 'Docente'
        ORDER BY g.grado, a.nombre;
    `;
    req.conexion.query(sql, [id], (err, result) => {
        if (err) {
            res.json({ mensaje: 'error' });
            console.log('Error en la consulta', err);
        } else {
            res.send(result.length > 0 ? result : { mensaje: 'No se encontraron asignaturas para este docente' });
        }
    });
});

module.exports = router;
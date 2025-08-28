const express = require('express');
const router = express.Router();
const { conexion } = require('./config/conexion');

router.get('/asignaturas-profesores', (req, res) => {
    let sql = 'SELECT * FROM TAsignaturas_Profesores';
    req.conexion.query(sql, (err, result) => {
        if (err) {
            console.log('Error en la consulta', err);
            res.status(500).json({ mensaje: 'Error al consultar' });
        } else {
            res.send(result);
        }
    });
});

router.post('/asignaturas-profesores', (req, res) => {
    let sqlMax = 'SELECT IFNULL(MAX(id_asignatura_profesor), 0) AS maxId FROM TAsignaturas_Profesores';
    req.conexion.query(sqlMax, (err, result) => {
        if (err) {
            console.log('Error al obtener último id_asignatura_profesor', err);
            return res.status(500).json({ mensaje: 'Error al generar ID' });
        }

        let nuevoId = result[0].maxId + 1;
        let data = {
            id_asignatura_profesor: nuevoId,
            id_asignatura: req.body.id_asignatura,
            id_personal: req.body.id_personal
        };
        let sqlInsert = 'INSERT INTO TAsignaturas_Profesores SET ?';
        req.conexion.query(sqlInsert, data, (err, resul) => {
            if (err) {
                console.log('Error en el insert', err);
                res.status(500).json({ mensaje: 'Error al insertar' });
            } else {
                res.json({ mensaje: 'Asignatura-Profesor creada', id_generado: nuevoId, data: data });
            }
        });
    });
});

router.put('/asignaturas-profesores/:id', (req, res) => {
    let id = req.params.id;
    let data = {
        id_asignatura: req.body.id_asignatura,
        id_personal: req.body.id_personal
    };
    let sql = 'UPDATE TAsignaturas_Profesores SET ? WHERE id_asignatura_profesor = ?';
    req.conexion.query(sql, [data, id], (err, result) => {
        if (err) {
            console.log('Error en el update', err);
            res.status(500).json({ mensaje: 'Error al actualizar' });
        } else {
            res.json({ mensaje: 'Asignatura-Profesor actualizada correctamente' });
        }
    });
});

router.delete('/asignaturas-profesores/:id', (req, res) => {
    let id = req.params.id;
    let sql = 'DELETE FROM TAsignaturas_Profesores WHERE id_asignatura_profesor = ?';
    req.conexion.query(sql, [id], (err, result) => {
        if (err) {
            console.log('Error al eliminar asignatura-profesor', err);
            res.status(500).json({ mensaje: 'Error al eliminar' });
        } else {
            res.json({ mensaje: 'Asignatura-Profesor eliminada correctamente' });
        }
    });
});

router.get('/asignaturas-profesores/:id', (req, res) => {
    let id = req.params.id;
    let sql = `
        SELECT 
            ap.id_asignatura_profesor,
            a.nombre AS NombreAsignatura,
            CONCAT(p.nombre, ' ', p.apellido1, COALESCE(' ' + p.apellido2, '')) AS NombreProfesor,
            p.ci AS CarnetProfesor
        FROM 
            TAsignaturas_Profesores ap
            INNER JOIN TAsignaturas a ON ap.id_asignatura = a.id_asignatura
            INNER JOIN TPersonal p ON ap.id_personal = p.id_personal
        WHERE ap.id_asignatura_profesor = ?
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

router.get('/docentes-por-asignatura-grado', (req, res) => {
    const { nivel, grado, paralelo, gestion } = req.query;
    let sql = `
        SELECT 
            p.id_personal,
            CONCAT(p.nombre, ' ', p.apellido1, COALESCE(' ' + p.apellido2, '')) AS NombreDocente,
            p.ci AS CarnetDocente,
            a.nombre AS NombreAsignatura,
            g.nivel AS Nivel,
            g.grado AS Grado,
            g.paralelo AS Paralelo,
            ga.gestion AS Gestion,
            h.turno AS Turno,
            h.hora_inicio AS HoraInicio,
            h.hora_fin AS HoraFin,
            h.dia_semana AS DiaSemana
        FROM 
            TAsignaturas_Profesores ap
            INNER JOIN TPersonal p ON ap.id_personal = p.id_personal
            INNER JOIN TAsignaturas a ON ap.id_asignatura = a.id_asignatura
            INNER JOIN TGrados_Asignaturas ga ON a.id_asignatura = ga.id_asignatura
            INNER JOIN TGrados g ON ga.id_grado = g.id_grado
            INNER JOIN THorarios h ON ga.id_horario = h.id_horario
        WHERE 
            g.nivel = ? AND g.grado = ? AND g.paralelo = ? AND ga.gestion = ?
    `;
    req.conexion.query(sql, [nivel, grado, paralelo, gestion], (err, result) => {
        if (err) {
            console.log('Error en la consulta', err);
            res.status(500).json({ mensaje: 'Error al consultar' });
        } else {
            res.send(result.length > 0 ? result : { mensaje: 'No se encontraron docentes' });
        }
    });
});

router.get('/docentes-asignaturas', (req, res) => {
    let sql = `
        SELECT 
            p.id_personal,
            CONCAT(p.nombre, ' ', p.apellido1, IFNULL(CONCAT(' ', p.apellido2), '')) AS NombreDocente,
            a.nombre AS NombreAsignatura
        FROM 
            TAsignaturas_Profesores ap
            INNER JOIN TPersonal p ON ap.id_personal = p.id_personal
            INNER JOIN TAsignaturas a ON ap.id_asignatura = a.id_asignatura
        ORDER BY p.id_personal
    `;
    req.conexion.query(sql, (err, result) => {
        if (err) {
            console.log('Error en la consulta', err);
            res.status(500).json({ mensaje: 'Error al consultar' });
        } else {
            res.send(result.length > 0 ? result : { mensaje: 'No se encontraron docentes con asignaturas' });
        }
    });
});

router.get('/docentes-asignaturas/:id_personal', (req, res) => {
    let id_personal = req.params.id_personal;
    let sql = `
        SELECT 
            p.id_personal,
            CONCAT(p.nombre, ' ', p.apellido1, IFNULL(CONCAT(' ', p.apellido2), '')) AS NombreDocente,
            a.nombre AS NombreAsignatura
        FROM 
            TAsignaturas_Profesores ap
            INNER JOIN TPersonal p ON ap.id_personal = p.id_personal
            INNER JOIN TAsignaturas a ON ap.id_asignatura = a.id_asignatura
        WHERE 
            p.id_personal = ?
        ORDER BY a.nombre
    `;
    req.conexion.query(sql, [id_personal], (err, result) => {
        if (err) {
            console.log('Error en la consulta', err);
            res.status(500).json({ mensaje: 'Error al consultar' });
        } else {
            res.send(result.length > 0 ? result : { mensaje: 'No se encontraron asignaturas para este docente' });
        }
    });
});

module.exports = router;
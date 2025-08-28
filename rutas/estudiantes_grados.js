const express = require('express');
const router = express.Router();
const { conexion } = require('./config/conexion');

router.get('/estudiantes-grados', (req, res) => {
    let sql = 'SELECT * FROM TEstudiantes_Grados';
    req.conexion.query(sql, (err, result) => {
        if (err) {
            console.log('Error en la consulta', err);
            res.status(500).json({ mensaje: 'Error al consultar' });
        } else {
            res.send(result);
        }
    });
});

router.post('/estudiantes-grados', (req, res) => {
    let sqlMax = 'SELECT IFNULL(MAX(id_estudiante_grado), 0) AS maxId FROM TEstudiantes_Grados';
    req.conexion.query(sqlMax, (err, result) => {
        if (err) {
            console.log('Error al obtener último id_estudiante_grado', err);
            return res.status(500).json({ mensaje: 'Error al generar ID' });
        }

        let nuevoId = result[0].maxId + 1;
        let data = {
            id_estudiante_grado: nuevoId,
            id_estudiante: req.body.id_estudiante,
            id_grado: req.body.id_grado,
            gestion: req.body.gestion
        };
        let sqlInsert = 'INSERT INTO TEstudiantes_Grados SET ?';
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

router.put('/estudiantes-grados/:id', (req, res) => {
    let id = req.params.id;
    let data = {
        id_estudiante: req.body.id_estudiante,
        id_grado: req.body.id_grado,
        gestion: req.body.gestion
    };
    let sql = 'UPDATE TEstudiantes_Grados SET ? WHERE id_estudiante_grado = ?';
    req.conexion.query(sql, [data, id], (err, result) => {
        if (err) {
            console.log('Error en el update', err);
            res.status(500).json({ mensaje: 'Error al actualizar' });
        } else {
            res.json({ mensaje: 'Relación actualizada correctamente' });
        }
    });
});

router.delete('/estudiantes-grados/:id', (req, res) => {
    let id = req.params.id;
    let sql = 'DELETE FROM TEstudiantes_Grados WHERE id_estudiante_grado = ?';
    req.conexion.query(sql, [id], (err, result) => {
        if (err) {
            console.log('Error al eliminar relación', err);
            res.status(500).json({ mensaje: 'Error al eliminar' });
        } else {
            res.json({ mensaje: 'Relación eliminada correctamente' });
        }
    });
});

router.get('/estudiantes-grados/:id', (req, res) => {
    let id = req.params.id;
    let sql = `
        SELECT 
            eg.id_estudiante_grado,
            CONCAT(e.nombre, ' ', e.apellido1, COALESCE(' ' + e.apellido2, '')) AS NombreEstudiante,
            e.ci AS CarnetEstudiante,
            g.nivel AS Nivel,
            g.grado AS Grado,
            g.paralelo AS Paralelo,
            eg.gestion AS Gestion
        FROM 
            TEstudiantes_Grados eg
            INNER JOIN TEstudiantes e ON eg.id_estudiante = e.id_estudiante
            INNER JOIN TGrados g ON eg.id_grado = g.id_grado
        WHERE eg.id_estudiante_grado = ?
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

router.get('/estudiantes-por-grado', (req, res) => {
    const { nivel, grado, paralelo, gestion } = req.query;
    let sql = `
        SELECT 
            e.id_estudiante,
            CONCAT(e.nombre, ' ', e.apellido1, COALESCE(' ' + e.apellido2, '')) AS NombreEstudiante,
            e.ci AS CarnetIdentidad,
            g.nivel AS Nivel,
            g.grado AS Grado,
            g.paralelo AS Paralelo,
            eg.gestion AS Gestion
        FROM 
            TEstudiantes e
            INNER JOIN TEstudiantes_Grados eg ON e.id_estudiante = eg.id_estudiante
            INNER JOIN TGrados g ON eg.id_grado = g.id_grado
        WHERE 
            g.nivel = ? AND g.grado = ? AND g.paralelo = ? AND eg.gestion = ?
    `;
    req.conexion.query(sql, [nivel, grado, paralelo, gestion], (err, result) => {
        if (err) {
            console.log('Error en la consulta', err);
            res.status(500).json({ mensaje: 'Error al consultar' });
        } else {
            res.send(result.length > 0 ? result : { mensaje: 'No se encontraron estudiantes' });
        }
    });
});

module.exports = router;
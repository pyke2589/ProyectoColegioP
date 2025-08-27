const { app, conexion, puerto } = require('./rutas/config/conexion');

const cargo = require('./rutas/cargo');
const personal = require('./rutas/personal');
const personaRelacion = require('./rutas/persona_relacion');
const aulas = require('./rutas/aulas');
const grados = require('./rutas/grados');
const asignaturas = require('./rutas/asignaturas');
const horarios = require('./rutas/horarios');
const gradosAsignaturas = require('./rutas/grados_asignaturas');
const inscripciones = require('./rutas/inscripciones');
const docentesAsignaturas = require('./rutas/docentes_asignaturas');
const calificaciones = require('./rutas/calificaciones');
const asistencias = require('./rutas/asistencias');
const reportesDisciplinarios = require('./rutas/reportes_disciplinarios');
const pagos = require('./rutas/pagos');

// Middleware para pasar la conexión a las rutas
app.use((req, res, next) => {
    req.conexion = conexion;
    next();
});

app.use('/api', cargo);
app.use('/api', personal);
app.use('/api', personaRelacion);
app.use('/api', aulas);
app.use('/api', grados);
app.use('/api', asignaturas);
app.use('/api', horarios);
app.use('/api', gradosAsignaturas);
app.use('/api', inscripciones);
app.use('/api', docentesAsignaturas);
app.use('/api', calificaciones);
app.use('/api', asistencias);
app.use('/api', reportesDisciplinarios);
app.use('/api', pagos);

app.listen(puerto, () => {
    console.log(`Servidor levantado en ${puerto}`);
});
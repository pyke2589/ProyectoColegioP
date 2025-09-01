const { app, conexion, puerto } = require('./rutas/config/conexion');
const cors = require('cors');

app.use(cors());


const cargo = require('./rutas/cargo');
const personal = require('./rutas/personal');
const apoderados = require('./rutas/apoderados');
const estudiantes = require('./rutas/estudiantes');
const aulas = require('./rutas/aulas');
const asignaturas = require('./rutas/asignaturas');
const horarios = require('./rutas/horarios');
const relacionApoderados = require('./rutas/relacion_apoderados');
const estudiantesApoderados = require('./rutas/estudiantes_apoderados');
const calificaciones = require('./rutas/calificaciones');
const reportesDisciplinarios = require('./rutas/reportes_disciplinarios');
const asistenciasPersonal = require('./rutas/asistencias_personal');
const asignaturasProfesores = require('./rutas/asignaturas_profesores');
const grados = require('./rutas/grados');
const estudiantesGrados = require('./rutas/estudiantes_grados');
const asistencias = require('./rutas/asistencias');
const gradosAsignaturas = require('./rutas/grados_asignaturas');

app.use((req, res, next) => {
    req.conexion = conexion;
    next();
});

app.use('/api', cargo);
app.use('/api', personal);
app.use('/api', apoderados);
app.use('/api', estudiantes);
app.use('/api', aulas);
app.use('/api', asignaturas);
app.use('/api', horarios);
app.use('/api', relacionApoderados);
app.use('/api', estudiantesApoderados);
app.use('/api', calificaciones);
app.use('/api', reportesDisciplinarios);
app.use('/api', asistenciasPersonal);
app.use('/api', asignaturasProfesores);
app.use('/api', grados);
app.use('/api', estudiantesGrados);
app.use('/api', asistencias);
app.use('/api', gradosAsignaturas);

app.listen(puerto, () => {
    console.log(`Servidor levantado en ${puerto}`);
});
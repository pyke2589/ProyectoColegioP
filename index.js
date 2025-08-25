const { app, puerto } = require('./rutas/config/conexion');

const personal = require('./rutas/personal');
const cargo = require('./rutas/cargo');
const personaRelacion = require('./rutas/persona_relacion');
const aulas = require('./rutas/aulas');
const grados = require('./rutas/grados');
const asignaturas = require('./rutas/asignaturas');
const horarios = require('./rutas/horarios');
const gradosAsignaturas = require('./rutas/grados_asignaturas');
const calificaciones = require('./rutas/calificaciones');
const asistencias = require('./rutas/asistencias');
const reportesDisciplinarios = require('./rutas/reportes_disciplinarios');

app.use('/api', personal);
app.use('/api', cargo);
app.use('/api', personaRelacion);
app.use('/api', aulas);
app.use('/api', grados);
app.use('/api', asignaturas);
app.use('/api', horarios);
app.use('/api', gradosAsignaturas);
app.use('/api', calificaciones);
app.use('/api', asistencias);
app.use('/api', reportesDisciplinarios);

app.listen(puerto, () => {
    console.log(`Servidor levantado en ${puerto}`);
});
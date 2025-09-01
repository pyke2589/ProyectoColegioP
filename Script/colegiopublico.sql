-- Crear base de datos
CREATE DATABASE colegiopublico;
USE colegiopublico;

-- ========================
-- TABLA DE CARGOS
-- ========================
CREATE TABLE TCargo (
    id_cargo INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(20) NOT NULL,
    sueldo_base INT NOT NULL
);

-- ========================
-- TABLA DE PERSONAL
-- ========================
CREATE TABLE TPersonal (
    id_personal INT AUTO_INCREMENT PRIMARY KEY,
    id_cargo INT NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    apellido1 VARCHAR(50) NOT NULL,
    apellido2 VARCHAR(50),
    ci VARCHAR(15) NOT NULL UNIQUE,
    turno VARCHAR(15) NOT NULL,
    correo VARCHAR(50) NOT NULL UNIQUE,
    clave VARCHAR(100) NOT NULL,
    contacto VARCHAR(15) NOT NULL,
    genero VARCHAR(10) NOT NULL,
    FOREIGN KEY (id_cargo) REFERENCES TCargo(id_cargo)
);

-- ========================
-- TABLA DE APODERADOS
-- ========================
CREATE TABLE TApoderados (
    id_apoderado INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido1 VARCHAR(50) NOT NULL,
    apellido2 VARCHAR(50),
    correo VARCHAR(100) UNIQUE,
    direccion VARCHAR(100) NOT NULL,
    ci VARCHAR(15) NOT NULL UNIQUE,
    contacto VARCHAR(15) NOT NULL
);

-- ========================
-- TABLA DE ESTUDIANTES
-- ========================
CREATE TABLE TEstudiantes (
    id_estudiante INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido1 VARCHAR(50) NOT NULL,
    apellido2 VARCHAR(50),
    fecha_nacimiento DATE NOT NULL,
    correo VARCHAR(100) UNIQUE,
    direccion VARCHAR(100) NOT NULL,
    ci VARCHAR(15) NOT NULL UNIQUE,
    contacto VARCHAR(15) NOT NULL
);

-- ========================
-- TABLA DE AULAS (con opción de laboratorio)
-- ========================
CREATE TABLE TAulas (
    id_aula INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    ubicacion VARCHAR(50) NOT NULL,
    capacidad INT NOT NULL,
    es_laboratorio BOOLEAN NOT NULL DEFAULT 0
);

-- ========================
-- TABLA DE ASIGNATURAS
-- ========================
CREATE TABLE TAsignaturas (
    id_asignatura INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

-- ========================
-- TABLA DE HORARIOS
-- ========================
CREATE TABLE THorarios (
    id_horario INT AUTO_INCREMENT PRIMARY KEY,
    turno VARCHAR(15) NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    dia_semana ENUM('Lunes','Martes','Miercoles','Jueves','Viernes') NOT NULL
);

-- ========================
-- RELACION APODERADOS - ESTUDIANTES
-- ========================
CREATE TABLE TRelacion_Apoderados (
    id_relacion INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE TEstudiantes_Apoderados (
    id_estudiante_apoderado INT AUTO_INCREMENT PRIMARY KEY,
    id_estudiante INT NOT NULL,
    id_apoderado INT NOT NULL,
    id_relacion INT NOT NULL,
    FOREIGN KEY (id_estudiante) REFERENCES TEstudiantes(id_estudiante),
    FOREIGN KEY (id_apoderado) REFERENCES TApoderados(id_apoderado),
    FOREIGN KEY (id_relacion) REFERENCES TRelacion_Apoderados(id_relacion)
);

-- ========================
-- CALIFICACIONES
-- ========================
CREATE TABLE TCalificaciones (
    id_calificacion INT AUTO_INCREMENT PRIMARY KEY,
    id_estudiante INT NOT NULL,
    id_asignatura INT NOT NULL,
    calificacion DECIMAL(5,2) NOT NULL,
    gestion VARCHAR(10) NOT NULL,
    FOREIGN KEY (id_estudiante) REFERENCES TEstudiantes(id_estudiante),
    FOREIGN KEY (id_asignatura) REFERENCES TAsignaturas(id_asignatura)
);

-- ========================
-- REPORTES DISCIPLINARIOS
-- ========================
CREATE TABLE TReportes_Disciplinarios (
    id_reporte INT AUTO_INCREMENT PRIMARY KEY,
    id_estudiante INT NOT NULL,
    id_personal INT NOT NULL,
    fecha_reporte DATETIME NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    sancion VARCHAR(50) NOT NULL,
    FOREIGN KEY (id_estudiante) REFERENCES TEstudiantes(id_estudiante),
    FOREIGN KEY (id_personal) REFERENCES TPersonal(id_personal)
);

-- ========================
-- ASISTENCIAS PERSONAL
-- ========================
CREATE TABLE TAsistencias_Personal (
    id_asistencia INT AUTO_INCREMENT PRIMARY KEY,
    id_personal INT NOT NULL,
    fecha_asistencia DATETIME NOT NULL DEFAULT NOW(),
    observacion VARCHAR(255),
    tipo VARCHAR(20) NOT NULL,
    FOREIGN KEY (id_personal) REFERENCES TPersonal(id_personal)
);

-- ========================
-- ASIGNATURAS - PROFESORES
-- ========================
CREATE TABLE TAsignaturas_Profesores (
    id_asignatura_profesor INT AUTO_INCREMENT PRIMARY KEY,
    id_asignatura INT NOT NULL,
    id_personal INT NOT NULL,
    FOREIGN KEY (id_asignatura) REFERENCES TAsignaturas(id_asignatura),
    FOREIGN KEY (id_personal) REFERENCES TPersonal(id_personal)
);

-- ========================
-- GRADOS
-- ========================
CREATE TABLE TGrados (
    id_grado INT AUTO_INCREMENT PRIMARY KEY,
    id_aula INT NOT NULL,
    nivel VARCHAR(15) NOT NULL, -- Primaria, Secundaria
    grado VARCHAR(15) NOT NULL, -- Primero, Segundo, etc.
    paralelo VARCHAR(10) NOT NULL,
    capacidad INT NOT NULL,
    FOREIGN KEY (id_aula) REFERENCES TAulas(id_aula)
);

-- ========================
-- ESTUDIANTES EN GRADOS
-- ========================
CREATE TABLE TEstudiantes_Grados (
    id_estudiante_grado INT AUTO_INCREMENT PRIMARY KEY,
    id_estudiante INT NOT NULL,
    id_grado INT NOT NULL,
    gestion INT NOT NULL,
    FOREIGN KEY (id_estudiante) REFERENCES TEstudiantes(id_estudiante),
    FOREIGN KEY (id_grado) REFERENCES TGrados(id_grado)
);

-- ========================
-- ASISTENCIAS ESTUDIANTES
-- ========================
CREATE TABLE TAsistencias (
    id_asistencia INT AUTO_INCREMENT PRIMARY KEY,
    id_estudiante INT NOT NULL,
    id_asignatura INT NOT NULL,
    fecha_asistencia DATETIME NOT NULL DEFAULT NOW(),
    tipo VARCHAR(15) NOT NULL,
    observacion VARCHAR(255),
    FOREIGN KEY (id_estudiante) REFERENCES TEstudiantes(id_estudiante),
    FOREIGN KEY (id_asignatura) REFERENCES TAsignaturas(id_asignatura)
);

-- ========================
-- RELACION GRADOS - ASIGNATURAS
-- ========================
CREATE TABLE TGrados_Asignaturas (
    id_grado_asignatura INT AUTO_INCREMENT PRIMARY KEY,
    id_grado INT NOT NULL,
    id_asignatura INT NOT NULL,
    id_horario INT NOT NULL,
    gestion INT NOT NULL,
    FOREIGN KEY (id_grado) REFERENCES TGrados(id_grado),
    FOREIGN KEY (id_asignatura) REFERENCES TAsignaturas(id_asignatura),
    FOREIGN KEY (id_horario) REFERENCES THorarios(id_horario)
);

CREATE DATABASE ColegioPublico;
USE ColegioPublico;

CREATE TABLE TCargo (
    id_cargo INT PRIMARY KEY AUTO_INCREMENT,
    nombre NVARCHAR(50) NOT NULL,
    sueldo_base DECIMAL(10,2) NOT NULL
);


CREATE TABLE TPersonal (
    id_persona INT PRIMARY KEY AUTO_INCREMENT,
    tipo_persona ENUM('Estudiante', 'Apoderado', 'Docente', 'Administrativo') NOT NULL,
    id_cargo INT,
    nombre NVARCHAR(50) NOT NULL,
    apellido1 NVARCHAR(50) NOT NULL,
    apellido2 NVARCHAR(50),
    ci NVARCHAR(15) UNIQUE NOT NULL,
    turno NVARCHAR(15),
    correo NVARCHAR(100) UNIQUE,
    clave NVARCHAR(100),
    contacto NVARCHAR(15),
    genero ENUM('Masculino', 'Femenino', 'Otro'),
    fecha_a DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado_a BIT DEFAULT 1,
    FOREIGN KEY (id_cargo) REFERENCES TCargo(id_cargo)
);


CREATE TABLE TPersona_Relacion (
    id_relacion INT PRIMARY KEY AUTO_INCREMENT,
    id_persona_estudiante INT NOT NULL,
    id_persona_apoderado INT NOT NULL,
    tipo_relacion ENUM('Padre', 'Madre', 'Tutor') NOT NULL,
    fecha_a DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado_a BIT DEFAULT 1,
    FOREIGN KEY (id_persona_estudiante) REFERENCES TPersonal(id_persona),
    FOREIGN KEY (id_persona_apoderado) REFERENCES TPersonal(id_persona)
);

-- ================================
-- 4. TAulas (Incluye laboratorios)
-- ================================
CREATE TABLE TAulas (
    id_aula INT PRIMARY KEY AUTO_INCREMENT,
    nombre NVARCHAR(50) NOT NULL,
    ubicacion NVARCHAR(50),
    tipo_aula ENUM('Aula', 'Laboratorio') NOT NULL,
    capacidad INT NOT NULL
);


CREATE TABLE TGrados (
    id_grado INT PRIMARY KEY AUTO_INCREMENT,
    id_aula INT NOT NULL,
    nivel ENUM('Primaria', 'Secundaria') NOT NULL,
    grado NVARCHAR(15) NOT NULL,
    paralelo NVARCHAR(5) NOT NULL,
    capacidad INT NOT NULL,
    FOREIGN KEY (id_aula) REFERENCES TAulas(id_aula)
);

CREATE TABLE TAsignaturas (
    id_asignatura INT PRIMARY KEY AUTO_INCREMENT,
    nombre NVARCHAR(50) NOT NULL
);

CREATE TABLE THorarios (
    id_horario INT PRIMARY KEY AUTO_INCREMENT,
    turno NVARCHAR(15) NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    dia_semana ENUM('Lunes','Martes','Miércoles','Jueves','Viernes') NOT NULL
);

CREATE TABLE TGrados_Asignaturas (
    id_grado_asignatura INT PRIMARY KEY AUTO_INCREMENT,
    id_grado INT NOT NULL,
    id_asignatura INT NOT NULL,
    id_horario INT NOT NULL,
    FOREIGN KEY (id_grado) REFERENCES TGrados(id_grado),
    FOREIGN KEY (id_asignatura) REFERENCES TAsignaturas(id_asignatura),
    FOREIGN KEY (id_horario) REFERENCES THorarios(id_horario)
);

CREATE TABLE TCalificaciones (
    id_calificacion INT PRIMARY KEY AUTO_INCREMENT,
    id_persona_estudiante INT NOT NULL,
    id_asignatura INT NOT NULL,
    calificacion DECIMAL(5,2) NOT NULL,
    gestion YEAR NOT NULL,
    FOREIGN KEY (id_persona_estudiante) REFERENCES TPersonal(id_persona),
    FOREIGN KEY (id_asignatura) REFERENCES TAsignaturas(id_asignatura)
);

CREATE TABLE TAsistencias (
    id_asistencia INT PRIMARY KEY AUTO_INCREMENT,
    id_persona_estudiante INT NOT NULL,
    id_asignatura INT NOT NULL,
    fecha_asistencia DATE NOT NULL,
    tipo ENUM('Presente', 'Ausente', 'Justificado') NOT NULL,
    observacion NVARCHAR(255),
    FOREIGN KEY (id_persona_estudiante) REFERENCES TPersonal(id_persona),
    FOREIGN KEY (id_asignatura) REFERENCES TAsignaturas(id_asignatura)
);

CREATE TABLE TReportes_Disciplinarios (
    id_reporte_disciplinario INT PRIMARY KEY AUTO_INCREMENT,
    id_persona_estudiante INT NOT NULL,
    id_persona_docente INT NOT NULL,
    fecha_reporte DATE NOT NULL,
    descripcion NVARCHAR(255) NOT NULL,
    sancion NVARCHAR(100),
    FOREIGN KEY (id_persona_estudiante) REFERENCES TPersonal(id_persona),
    FOREIGN KEY (id_persona_docente) REFERENCES TPersonal(id_persona)
);

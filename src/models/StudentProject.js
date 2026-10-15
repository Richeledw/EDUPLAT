/**
 * @file StudentProject.js
 * @description Modelo de Mongoose para el Espacio de Trabajo de Proyectos Prácticos por curso (Project Workspace).
 * Almacena los entregables, bitácora progresiva, repositorios, despliegues y la retroalimentación docente.
 */

const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
    docenteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    docenteNombre: {
        type: String,
        default: 'Docente EduPlat'
    },
    docenteRol: {
        type: String,
        default: 'docente'
    },
    comentario: {
        type: String,
        required: [true, 'El comentario de retroalimentación es obligatorio']
    },
    calificacion: {
        type: Number,
        min: 0,
        max: 100,
        default: null
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});

const StudentProjectSchema = new mongoose.Schema({
    estudiante: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El estudiante es obligatorio']
    },
    estudianteNombre: {
        type: String,
        required: true
    },
    estudianteEmail: {
        type: String,
        required: true
    },
    cursoId: {
        type: String,
        required: [true, 'El curso es obligatorio']
    },
    cursoTitulo: {
        type: String,
        default: ''
    },
    titulo: {
        type: String,
        default: 'Mi Proyecto Práctico del Curso'
    },
    descripcion: {
        type: String,
        default: ''
    },
    notasAvance: {
        type: String,
        default: ''
    },
    repositorioUrl: {
        type: String,
        default: ''
    },
    despliegueUrl: {
        type: String,
        default: ''
    },
    estado: {
        type: String,
        enum: ['En Progreso', 'En Revisión', 'Completado'],
        default: 'En Progreso'
    },
    retroalimentacion: [FeedbackSchema],
    actualizadoEn: {
        type: Date,
        default: Date.now
    },
    creadoEn: {
        type: Date,
        default: Date.now
    }
});

// Índice compuesto para tener un único proyecto por estudiante por curso
StudentProjectSchema.index({ estudiante: 1, cursoId: 1 }, { unique: true });

module.exports = mongoose.model('StudentProject', StudentProjectSchema);

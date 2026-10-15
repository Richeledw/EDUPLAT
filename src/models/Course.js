/**
 * @file Course.js
 * @description Modelo de Mongoose para cursos en la plataforma EduPlat.
 * Incluye soporte para módulos, lecciones con videos y explicaciones extendidas,
 * recursos descargables (PDFs, repositorios, guías) y consigna del proyecto práctico.
 */

const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: [true, 'El título del recurso es obligatorio']
    },
    tipo: {
        type: String,
        enum: ['pdf', 'link', 'github', 'zip', 'guia', 'archivo'],
        default: 'link'
    },
    url: {
        type: String,
        required: [true, 'La URL o ruta del recurso es obligatoria']
    },
    descripcion: {
        type: String,
        default: ''
    }
});

const LessonSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    titulo: {
        type: String,
        required: [true, 'El título de la lección es obligatorio']
    },
    duracion: {
        type: String,
        default: '15 min'
    },
    videoUrl: {
        type: String,
        default: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    explicacionDetallada: {
        type: String,
        default: ''
    },
    codigoEjemplo: {
        type: String,
        default: ''
    },
    lenguajeCodigo: {
        type: String,
        default: 'javascript'
    },
    recursos: [ResourceSchema],
    orden: {
        type: Number,
        default: 1
    }
});

const ModuleSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: [true, 'El título del módulo es obligatorio']
    },
    descripcion: {
        type: String,
        default: ''
    },
    orden: {
        type: Number,
        default: 1
    },
    lecciones: [LessonSchema]
});

const CourseSchema = new mongoose.Schema({
    id: {
        type: String,
        required: [true, 'El ID o slug del curso es obligatorio'],
        unique: true,
        trim: true,
        lowercase: true
    },
    titulo: {
        type: String,
        required: [true, 'El título del curso es obligatorio'],
        trim: true
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción corta es obligatoria']
    },
    descripcionLarga: {
        type: String,
        default: ''
    },
    icono: {
        type: String,
        default: '/img/html5.svg'
    },
    categoria: {
        type: String,
        enum: ['web', 'backend', 'datos', 'diseno', 'mobile', 'devops'],
        default: 'web'
    },
    nivel: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'Principiante', 'Intermedio', 'Avanzado'],
        default: 'Beginner'
    },
    duracion: {
        type: String,
        default: '10 horas'
    },
    calificacion: {
        type: Number,
        default: 4.8
    },
    resenas: {
        type: Number,
        default: 0
    },
    color: {
        type: String,
        default: 'primary'
    },
    autor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    autorNombre: {
        type: String,
        default: 'Profesor EduPlat'
    },
    publicado: {
        type: Boolean,
        default: true
    },
    // Consigna o especificación del proyecto práctico del curso
    proyectoConsigna: {
        titulo: {
            type: String,
            default: 'Proyecto Final Práctico'
        },
        descripcion: {
            type: String,
            default: 'Construye un proyecto completo aplicando todos los conceptos del curso.'
        },
        requisitos: [{
            type: String
        }],
        recursosApoyo: [{
            type: String
        }]
    },
    // Módulos y lecciones
    modulos: [ModuleSchema],
    // Recursos globales adicionales del curso
    recursosGlobales: [ResourceSchema],
    creadoEn: {
        type: Date,
        default: Date.now
    }
});

// Helper virtual para contar total de lecciones
CourseSchema.virtual('totalLecciones').get(function () {
    if (!this.modulos || this.modulos.length === 0) return 0;
    return this.modulos.reduce((acc, m) => acc + (m.lecciones ? m.lecciones.length : 0), 0);
});

module.exports = mongoose.model('Course', CourseSchema);

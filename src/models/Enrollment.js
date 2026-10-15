/**
 * @file Enrollment.js
 * @description Modelo de Mongoose para gestionar las matrículas e inscripciones de estudiantes en cursos.
 */

const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema({
    estudiante: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El estudiante es obligatorio']
    },
    curso: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },
    cursoId: {
        type: String,
        required: [true, 'El identificador del curso es obligatorio']
    },
    fechaInscripcion: {
        type: Date,
        default: Date.now
    },
    leccionesCompletadas: [{
        type: String
    }],
    progreso: {
        type: Number,
        default: 0
    },
    ultimoAcceso: {
        type: Date,
        default: Date.now
    }
});

// Índice compuesto para evitar inscripciones duplicadas
EnrollmentSchema.index({ estudiante: 1, cursoId: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', EnrollmentSchema);

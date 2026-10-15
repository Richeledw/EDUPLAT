/**
 * @file User.js
 * @description Modelo de Mongoose para representar y gestionar los usuarios/estudiantes en la base de datos MongoDB.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Definición del esquema del usuario
const UserSchema = new mongoose.Schema({
    // Nombre completo del usuario
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    // Correo electrónico único con validación de formato mediante expresión regular
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Por favor agrega un email válido'
        ]
    },
    // Contraseña encriptada. Se marca 'select: false' para que no sea recuperada
    // por defecto en consultas a menos que se solicite de forma explícita.
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
        minlength: 6,
        select: false
    },
    // Rol del usuario en la plataforma. Por defecto es 'estudiante'.
    // Roles disponibles: 'estudiante', 'docente', 'admin'
    rol: {
        type: String,
        enum: ['estudiante', 'docente', 'admin'],
        default: 'estudiante'
    },
    // Listado de cursos en los que el usuario se ha inscrito y su respectivo avance
    cursosInscritos: [{
        // Identificador único del curso (ej. 'html', 'css')
        cursoId: {
            type: String,
            required: true
        },
        // Fecha en la que el usuario inició el curso
        fechaInscripcion: {
            type: Date,
            default: Date.now
        },
        // Lista de IDs/slugs de las lecciones completadas por el estudiante en este curso
        leccionesCompletadas: [{
            type: String
        }],
        // Porcentaje general del progreso (de 0 a 100)
        progreso: {
            type: Number,
            default: 0
        }
    }],
    // Estado de la cuenta: activa o suspendida/desactivada
    activo: {
        type: Boolean,
        default: true
    },
    // Fecha de creación del registro del usuario
    creadoEn: {
        type: Date,
        default: Date.now
    }
});

/**
 * @description Hook pre-save de Mongoose. Antes de guardar el documento en la base de datos,
 * verifica si la contraseña ha sido modificada. Si es así, genera un salt y realiza el hash
 * de la contraseña antes de persistirla por seguridad.
 * Nota: en Mongoose moderno, los hooks async no deben usar next() como parámetro.
 */
UserSchema.pre('save', async function () {
    // Si la contraseña no ha cambiado, salimos sin hacer nada
    if (!this.isModified('password')) {
        return;
    }
    // Generación del Salt con un factor de costo de 10
    const salt = await bcrypt.genSalt(10);
    // Reemplazar la contraseña en texto plano con el hash encriptado
    this.password = await bcrypt.hash(this.password, salt);
});

/**
 * @method matchPassword
 * @description Compara una contraseña introducida por el usuario con el hash almacenado en la base de datos.
 * @param {string} enteredPassword - La contraseña proporcionada por el usuario al intentar iniciar sesión.
 * @returns {Promise<boolean>} Devuelve true si la contraseña coincide, false en caso contrario.
 */
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Exportamos el modelo compilado bajo el nombre 'User'
module.exports = mongoose.model('User', UserSchema);

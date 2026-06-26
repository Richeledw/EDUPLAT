const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Por favor agrega un email válido'
        ]
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
        minlength: 6,
        select: false // No devolver la contraseña por defecto en consultas
    },
    rol: {
        type: String,
        enum: ['estudiante', 'admin'],
        default: 'estudiante'
    },
    cursosInscritos: [{
        cursoId: {
            type: String,
            required: true
        },
        fechaInscripcion: {
            type: Date,
            default: Date.now
        },
        leccionesCompletadas: [{
            type: String // ID o slug de la lección
        }],
        progreso: {
            type: Number,
            default: 0 // Porcentaje de 0 a 100
        }
    }],
    creadoEn: {
        type: Date,
        default: Date.now
    }
});

// Encriptar contraseña usando bcrypt
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Método para verificar contraseña
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);

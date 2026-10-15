/**
 * @file server.js
 * @description Punto de entrada principal para el servidor de Eduplat.
 * Se encarga de inicializar la aplicación Express, configurar middlewares globales (sesiones, passport, recursos estáticos)
 * y registrar las rutas modulares de la arquitectura MVC.
 */

const express = require('express');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo').default; // Gestor de persistencia de sesiones en MongoDB
const flash = require('connect-flash');       // Para enviar mensajes informativos temporales entre redirecciones
const dotenv = require('dotenv');

// Cargar variables de entorno del archivo .env
dotenv.config();

// Importar configuración de conexión a la BD y autenticación
const connectDB = require('./src/config/db');

// Inicializar la aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// Configurar estrategias de Passport para el manejo de sesiones de usuario
require('./src/config/passport')(passport);

// Establecer la conexión con MongoDB
connectDB();

// ============================================
// CONFIGURACIÓN DEL MOTOR DE VISTAS (EJS)
// ============================================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ============================================
// MIDDLEWARES GLOBALES
// ============================================

// Servir archivos estáticos desde el directorio '/public'
// Si se solicita un archivo SVG, nos aseguramos de que el navegador lo interprete con el tipo MIME correcto.
app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, path) => {
        if (path.endsWith('.svg')) {
            res.type('image/svg+xml');
        }
    }
}));

// Middlewares para analizar el cuerpo de las peticiones (Body Parsers)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuración de Sesiones con almacenamiento persistente en MongoDB (7 días)
app.use(session({
    secret: process.env.SESSION_SECRET || 'secreto',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 días de persistencia de sesión
        httpOnly: true,
        sameSite: 'lax'
    }
}));

// Inicializar Passport y conectar con la sesión del usuario
app.use(passport.initialize());
app.use(passport.session());

// Habilitar mensajes flash para notificaciones rápidas al usuario
app.use(flash());

// Middleware para inyectar variables globales disponibles en todas las vistas renderizadas por EJS
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error'); // Errores generados internamente por Passport
    res.locals.user = req.user || null;    // Objeto del usuario autenticado (si inició sesión)
    next();
});

// ============================================
// IMPORTACIÓN Y MONTAJE DE RUTAS
// ============================================
const indexRoutes   = require('./src/routes/indexRoutes');
const authRoutes    = require('./src/routes/authRoutes');
const panelRoutes   = require('./src/routes/panelRoutes');
const cursoRoutes   = require('./src/routes/cursoRoutes');
const adminRoutes   = require('./src/routes/adminRoutes');
const docenteRoutes = require('./src/routes/docenteRoutes');

// Montamos los enrutadores en la raíz de la aplicación
app.use('/', indexRoutes);
app.use('/', authRoutes);
app.use('/', panelRoutes);
app.use('/', cursoRoutes);
app.use('/', adminRoutes);
app.use('/', docenteRoutes);

// ============================================
// GESTIÓN DE ERRORES (404 Not Found)
// ============================================
app.use((req, res) => {
    res.status(404).render('error', {
        mensaje: 'Página no encontrada',
        descripcion: 'Lo sentimos, la página que buscas no existe.'
    });
});

// Arrancar el servidor HTTP
app.listen(PORT, () => {
    console.log(`Servidor corriendo exitosamente en: http://localhost:${PORT}`);
});

module.exports = app;

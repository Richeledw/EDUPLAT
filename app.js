// app.js - Servidor principal con Express y EJS

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const flash = require('connect-flash');
const dotenv = require('dotenv');

// Cargar configuración
dotenv.config();
const connectDB = require('./config/db');
const User = require('./models/User');
const sendEmail = require('./utils/email');

// Inicializar app
const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de Passport
require('./config/passport')(passport);

// Conectar a Base de Datos
connectDB();

// ============================================
// CONFIGURACIÓN DE EJS Y VISTAS
// ============================================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ============================================
// MIDDLEWARE
// ============================================

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'static'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.svg')) {
      res.type('image/svg+xml');
    }
  }
}));

// Body parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Express Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'secreto',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

// Variables Globales (para acceder al usuario y mensajes en todas las vistas)
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error'); // Mensajes de error de Passport
  res.locals.user = req.user || null;
  next();
});

// ============================================
// DATOS DE CURSOS (Datos estáticos por ahora)
// ============================================
const cursos = {
  'html': {
    id: 'html',
    titulo: 'HTML Básico',
    descripcion: 'Aprende los fundamentos de HTML y estructura web desde cero.',
    icono: '/img/html5.svg',
    categoria: 'web',
    nivel: 'Beginner',
    calificacion: 4.8,
    resenas: 245,
    duracion: '8 horas',
    lecciones: 24,
    color: 'danger'
  },
  'css': {
    id: 'css',
    titulo: 'CSS Esencial',
    descripcion: 'Domina el diseño y estilos web con CSS.',
    icono: '/img/css3-alt.svg',
    categoria: 'web',
    nivel: 'Beginner',
    calificacion: 4.9,
    resenas: 312,
    duracion: '10 horas',
    lecciones: 28,
    color: 'info'
  },
  'javascript': {
    id: 'javascript',
    titulo: 'JavaScript Introducción',
    descripcion: 'Introducción a la programación con JavaScript.',
    icono: '/img/js.svg',
    categoria: 'web',
    nivel: 'Beginner',
    calificacion: 4.7,
    resenas: 198,
    duracion: '12 horas',
    lecciones: 32,
    color: 'warning'
  },
  'python': {
    id: 'python',
    titulo: 'Python Fundamental',
    descripcion: 'Aprende Python desde cero.',
    icono: '/img/python.svg',
    categoria: 'backend',
    nivel: 'Beginner',
    calificacion: 4.9,
    resenas: 423,
    duracion: '14 horas',
    lecciones: 36,
    color: 'primary'
  },
  'sql': {
    id: 'sql',
    titulo: 'SQL Databases',
    descripcion: 'Domina las bases de datos SQL.',
    icono: '/img/mysql.svg',
    categoria: 'backend',
    nivel: 'Beginner',
    calificacion: 4.8,
    resenas: 201,
    duracion: '11 horas',
    lecciones: 30,
    color: 'danger'
  },
  'typescript': {
    id: 'typescript',
    titulo: 'TypeScript Mastery',
    descripcion: 'Tipado estricto y patrones avanzados.',
    icono: '/img/typescript.svg',
    categoria: 'web',
    nivel: 'Advanced',
    calificacion: 4.9,
    resenas: 89,
    duracion: '9 horas',
    lecciones: 26,
    color: 'secondary'
  }
};

// ============================================
// RUTAS PRINCIPALES
// ============================================

app.get('/', (req, res) => {
  res.render('home', {
    datosHome: {
      titulo: 'Eduplat - Tu Plataforma de Aprendizaje',
      subtitulo: 'Aprende nuevas habilidades con cursos de calidad'
    }
  });
});

app.get('/temas', (req, res) => {
  res.render('temas', {
    datosTemas: {
      titulo: 'Nuestros Cursos',
      descripcion: 'Explora nuestra amplia variedad de cursos',
      cursos: Object.values(cursos)
    }
  });
});

// AUTENTICACIÓN

// Registro - Mostrar Formulario
app.get('/registro', (req, res) => {
  res.render('registro', {
    datosRegistro: {
      titulo: 'Crear Cuenta',
      descripcion: 'Únete a nuestra comunidad de aprendizaje'
    }
  });
});

// Registro - Procesar
app.post('/registro', async (req, res) => {
  const { nombre, email, password } = req.body;
  let errors = [];

  // Validaciones básicas
  if (!nombre || !email || !password) {
    errors.push({ msg: 'Por favor rellena todos los campos' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'La contraseña debe tener al menos 6 caracteres' });
  }

  if (errors.length > 0) {
    return res.render('registro', {
      errors,
      nombre,
      email,
      password,
      datosRegistro: { titulo: 'Crear Cuenta', descripcion: 'Únete a nuestra comunidad' }
    });
  }

  try {
    // Verificar usuario existente
    let user = await User.findOne({ email: email });
    if (user) {
      errors.push({ msg: 'El email ya está registrado' });
      return res.render('registro', {
        errors,
        nombre,
        email,
        password,
        datosRegistro: { titulo: 'Crear Cuenta', descripcion: 'Únete a nuestra comunidad' }
      });
    }

    // Crear nuevo usuario
    const newUser = new User({
      nombre,
      email,
      password
    });

    // Guardar (el hash se hace en el modelo)
    await newUser.save();

    // Enviar Email de Bienvenida
    const message = `Hola ${nombre},\n\nGracias por unirte a Eduplat. Estamos emocionados de tenerte aquí.`;
    const html = `<p>Hola <strong>${nombre}</strong>,</p><p>Gracias por unirte a Eduplat. Estamos emocionados de tenerte aquí.</p>`;

    try {
      await sendEmail({
        email: newUser.email,
        subject: '¡Bienvenido a Eduplat!',
        message,
        html
      });
    } catch (emailError) {
      console.error('Error enviando email de bienvenida:', emailError);
      // No bloqueamos el registro si falla el email, solo logueamos
    }

    // Iniciar sesión automáticamente después del registro
    req.login(newUser, (err) => {
      if (err) {
        console.error(err);
        return res.redirect('/login');
      }
      req.flash('success_msg', '¡Bienvenido! Completa tu perfil y comienza a aprender.');
      res.redirect('/panel');
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Error en el servidor');
  }
});

// Login - Mostrar Formulario
app.get('/login', (req, res) => {
  res.render('login', {
    datosLogin: {
      titulo: 'Iniciar Sesión',
      descripcion: 'Accede a tus cursos y progreso'
    }
  });
});

// Login - Procesar
app.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/temas',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
app.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    req.flash('success_msg', 'Has cerrado sesión exitosamente');
    res.redirect('/');
  });
});

// Middleware de Autenticación Requerida
const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

// Panel de Usuario / Dashboard
app.get('/panel', isAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('cursosInscritos');
    
    const cursosInscritos = user.cursosInscritos.map(ci => ({
      ...cursos[ci.cursoId],
      progreso: ci.progreso,
      leccionesCompletadas: ci.leccionesCompletadas.length,
      fechaInscripcion: ci.fechaInscripcion
    }));

    res.render('panel', {
      titlePage: 'Mi Panel de Aprendizaje',
      user: user,
      cursosInscritos: cursosInscritos,
      totalCursos: cursosInscritos.length,
      progresoPromedio: cursosInscritos.length > 0 
        ? Math.round(cursosInscritos.reduce((a, b) => a + b.progreso, 0) / cursosInscritos.length)
        : 0
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});

// Configuración de Usuario
app.get('/configuracion', isAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.render('configuracion', {
      titlePage: 'Configuración',
      user: user
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});

// ============================================
// RUTAS DINÁMICAS Y DE CURSOS
// ============================================

app.get('/curso/:id', (req, res) => {
  const { id } = req.params;
  const curso = cursos[id];

  if (!curso) {
    return res.status(404).render('error', {
      mensaje: 'Curso no encontrado',
      descripcion: 'El curso que buscas no existe.'
    });
  }

  const datosCurso = {
    ...curso,
    cursos_relacionados: Object.values(cursos)
      .filter(c => c.id !== id && c.categoria === curso.categoria)
      .slice(0, 3)
  };

  res.render('curso', { datosCurso });
});

// Ruta para marcar lección como completada (Ejemplo de API)
app.post('/api/progreso/completar', async (req, res) => {
  if (!req.user) return res.status(401).json({ success: false, msg: 'No autorizado' });

  const { cursoId, leccionId } = req.body;

  try {
    const user = await User.findById(req.user.id);

    // Buscar si el usuario ya tiene el curso
    let cursoInscrito = user.cursosInscritos.find(c => c.cursoId === cursoId);

    if (!cursoInscrito) {
      // Inscribir curso si no existe
      user.cursosInscritos.push({
        cursoId: cursoId,
        leccionesCompletadas: [leccionId],
        progreso: 0 // Se calcularía basado en total de lecciones
      });
    } else {
      // Agregar lección si no existe
      if (!cursoInscrito.leccionesCompletadas.includes(leccionId)) {
        cursoInscrito.leccionesCompletadas.push(leccionId);
      }
    }

    await user.save();
    res.json({ success: true, progreso: cursoInscrito ? cursoInscrito.leccionesCompletadas.length : 1 });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: 'Error al actualizar progreso' });
  }
});

// ============================================
// OTRAS RUTAS
// ============================================

app.get('/contacto', (req, res) => {
  res.render('contacto', {
    datosContacto: {
      titulo: 'Contáctanos',
      descripcion: 'Nos gustaría saber de ti',
      email: 'info@eduplat.com',
      telefono: '+54 9 1234567890',
      ubicacion: 'Buenos Aires, Argentina'
    }
  });
});

app.post('/contacto', (req, res) => {
  // Lógica de contacto...
  res.render('contacto', {
    datosContacto: { titulo: 'Contáctanos', descripcion: '...' },
    mensaje_exito: '¡Gracias por tu mensaje! Nos pondremos en contacto pronto.'
  });
});

app.use((req, res) => {
  res.status(404).render('error', {
    mensaje: 'Página no encontrada',
    descripcion: 'Lo sentimos, la página que buscas no existe.'
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en: http://localhost:${PORT}`);
});

module.exports = app;

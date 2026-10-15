/**
 * @file db.js
 * @description Configuración y establecimiento de la conexión con la base de datos MongoDB utilizando Mongoose.
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Verifica si la variable de entorno MONGO_URI está definida.
// Si no lo está, carga el archivo de configuración .env para poder leerla.
if (!process.env.MONGO_URI) {
    dotenv.config();
}

/**
 * @function connectDB
 * @async
 * @description Intenta establecer la conexión con MongoDB usando Mongoose.
 * Si la conexión falla, escribe el error en la consola y finaliza la ejecución del proceso del servidor con código de error (1).
 */
const connectDB = async () => {
    try {
        // Conexión a la base de datos usando la URI almacenada en las variables de entorno
        const conn = await mongoose.connect(process.env.MONGO_URI);
        
        // Mensaje de confirmación con el host al que se conectó
        console.log(`MongoDB Conectado: ${conn.connection.host}`);

        // Sembrar cursos por defecto si la base de datos es nueva
        const { seedCoursesIfNeeded } = require('../utils/seedCourses');
        await seedCoursesIfNeeded();
    } catch (error) {
        // En caso de error, se imprime en consola y se aborta el inicio del servidor
        console.error(`Error de conexión a MongoDB: ${error.message}`);
        process.exit(1);
    }
};

// Exportamos la función de conexión para poder invocarla desde el punto de entrada principal (server.js)
module.exports = connectDB;

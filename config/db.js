const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Cargar variables de entorno si no están cargadas
if (!process.env.MONGO_URI) {
    dotenv.config();
}

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Conectado: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;

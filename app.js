// app.js
require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const { syncDatabase } = require('./database'); // ← Cambiado de './config/database'

const app = express();

// Sincronizar base de datos al iniciar
syncDatabase();

// Middleware
app.use(express.json());

// Rutas
app.use('/auth', require('./routes/auth'));
app.use('/users', require('./routes/users'));

// Swagger
try {
  const swaggerDocument = YAML.load('./swagger.yaml');
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (error) {
  console.log('Swagger documentation not available');
}

// Health check
app.get('/ping', (req, res) => {
  res.status(200).send('');
});

app.get('/about', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      nombreCompleto: "Estefani Jeannielys Gonzalez Gonzalez",
      cedula: "32057736",
      seccion: "1"
    }
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'success',
    data: { 
      status: 'OK', 
      message: 'Server is running',
      timestamp: new Date().toISOString()
    }
  });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

module.exports = app;
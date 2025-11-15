require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const app = express();

// Cargar spec preferentemente desde `swagger.yaml`, si no existe intentar
// cargar `./config/swagger.js` (swagger-jsdoc) y, si tampoco, dejar vacío.
let swaggerDocToUse = {};
try {
  const yamlPath = path.join(__dirname, 'swagger.yaml');
  if (require('fs').existsSync(yamlPath)) {
    swaggerDocToUse = YAML.load(yamlPath);
    console.log('Using swagger.yaml for /api-docs');
  } else {
    // intentar cargar config/swagger.js si existe
    try {
      const swaggerCfg = require('./config/swagger');
      swaggerDocToUse = swaggerCfg && swaggerCfg.specs ? swaggerCfg.specs : {};
      console.log('Using swagger-jsdoc specs for /api-docs');
    } catch (e) {
      console.log('No swagger.yaml or config/swagger.js found — /api-docs will be empty');
      swaggerDocToUse = {};
    }
  }
} catch (e) {
  console.warn('Error loading swagger spec:', e.message || e);
  swaggerDocToUse = {};
}
// Nota: la sincronización de la base de datos se realiza en el binario (./bin/www)
// para evitar efectos secundarios cuando `app` es requerido por tests.

// Middleware
app.use(express.json());

// Rutas
const userRoutes = require('./routes/users');
// Montar endpoints de auth también bajo /api/users para compatibilidad con tests
app.use('/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/auth'));
app.use('/users', userRoutes);
app.use('/api/users', userRoutes);

// AGREGAR ESTAS NUEVAS RUTAS
app.use('/api/categories', require('./routes/categories'));
app.use('/api/tags', require('./routes/tags'));
app.use('/api/products', require('./routes/products'));
app.use('/categories', require('./routes/categories'));
app.use('/products', require('./routes/products'));
app.use('/tags', require('./routes/tags'));

// Ruta pública de 'self-healing' para productos en la raíz: /p/:id-:slug
// Algunos tests y clientes esperan acceder a productos mediante /p/{id}-{slug}
const productController = require('./controllers/productController');
app.get('/p/:id-:slug', productController.getProductBySlug);

// Endpoint para inspeccionar el spec consumido por Swagger UI
app.get('/api-docs.json', (req, res) => {
  res.json(swaggerDocToUse);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocToUse, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Maze Runner Books API Documentation"
}));

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

// (no additional /api-docs setup)
module.exports = app;

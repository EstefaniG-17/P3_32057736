var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var swaggerJsdoc = require('swagger-jsdoc');
var swaggerUi = require('swagger-ui-express');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de Swagger CORREGIDA
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API P3 Cédula',
      version: '1.0.0',
      description: 'API RESTful para el proyecto P3',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo',
      },
    ],
  },
  apis: [path.join(__dirname, 'app.js')], // ✅ RUTA ABSOLUTA - ESTO ES CLAVE
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ✅ COMENTARIOS SWAGGER CORREGIDOS - DEBEN ESTAR JUSTO ANTES de cada ruta

/**
 * @swagger
 * /ping:
 *   get:
 *     summary: Endpoint de verificación de salud
 *     description: Verifica que el servidor esté funcionando correctamente
 *     responses:
 *       200:
 *         description: OK - Servidor funcionando
 */
app.get('/ping', function(req, res) {
  res.status(200).send();
});

/**
 * @swagger
 * /about:
 *   get:
 *     summary: Obtiene información del desarrollador
 *     description: Retorna información personal del desarrollador en formato JSend
 *     responses:
 *       200:
 *         description: Información obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     nombreCompleto:
 *                       type: string
 *                       example: "Estefani Jeannielyz Gonzalez Gonzalez"
 *                     cedula:
 *                       type: string
 *                       example: "32057736"
 *                     seccion:
 *                       type: string
 *                       example: "2"
 */
app.get('/about', function(req, res) {
  res.json({
    status: "success",
    data: {
      nombreCompleto: "Estefani Jeannielyz Gonzalez Gonzalez", // Reemplaza con tu nombre
      cedula: "32057736", // Reemplaza con tu cédula
      seccion: "2" // Reemplaza con tu sección
    }
  });
});

module.exports = app;
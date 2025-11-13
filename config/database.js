const path = require('path');
const { Sequelize } = require('sequelize');

module.exports = {
  development: {
    storage: path.join(__dirname, '..', 'database.sqlite'),
    dialect: 'sqlite', // ✅ AGREGAR ESTA LÍNEA
    logging: console.log
  },
  test: {
    storage: ':memory:',
    dialect: 'sqlite', // ✅ AGREGAR ESTA LÍNEA
    logging: false
  },
  production: {
    storage: path.join(__dirname, '..', 'database.sqlite'),
    dialect: 'sqlite', // ✅ AGREGAR ESTA LÍNEA
    logging: false
  }
};

// Crear y exportar una instancia de Sequelize para compatibilidad con tests
// que hacen: const { sequelize } = require('../config/database')
try {
  const env = process.env.NODE_ENV || 'development';
  const cfg = module.exports[env];
  const sequelize = new Sequelize({
    dialect: cfg.dialect,
    storage: cfg.storage,
    logging: cfg.logging
  });

  // Añadir la instancia al objeto exportado
  module.exports.sequelize = sequelize;
} catch (err) {
  // Si algo falla, no romper la carga del módulo
  console.error('Warning: could not create sequelize instance from config:', err.message || err);
}
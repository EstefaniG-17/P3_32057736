const { Sequelize } = require('sequelize');

let storage;

if (process.env.NODE_ENV === 'test') {
  // Usar base de datos en memoria para tests (más rápido y aislado)
  storage = ':memory:';
} else {
  storage = './database.sqlite';
}

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: storage,
  logging: process.env.NODE_ENV === 'development', // Solo logs en desarrollo
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Función para verificar conexión
sequelize.authenticate()
  .then(() => {
    console.log(`✅ Conexión a SQLite establecida (${process.env.NODE_ENV || 'development'})`);
  })
  .catch(err => {
    console.error('❌ Error conectando a SQLite:', err);
  });

module.exports = { sequelize };
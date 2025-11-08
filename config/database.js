const { Sequelize } = require('sequelize');

let storage;

if (process.env.NODE_ENV === 'test') {
  // Usar base de datos en memoria para tests
  storage = ':memory:';
} else {
  storage = './database.sqlite';
}

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: storage,
  logging: false, // Desactivar logs en tests
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

module.exports = { sequelize };
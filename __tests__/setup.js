const { sequelize } = require('../config/database');

// Configuración global para tests
beforeAll(async () => {
  // Sincronizar base de datos antes de todos los tests
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  // Cerrar conexión después de todos los tests
  await sequelize.close();
});

// Timeout global para tests
jest.setTimeout(30000);
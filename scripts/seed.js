// Reemplazado: este script ya no crea productos distintos de libros.
// Ahora delega a `scripts/seedData.js` que contiene la semilla de libros Maze Runner.
const seedData = require('./seedData');

const run = async () => {
  try {
    await seedData();
    console.log('✅ seed.js: ejecutado seedData.js');
  } catch (err) {
    console.error('❌ seed.js error:', err && err.stack ? err.stack : err);
  }
};

if (require.main === module) run();

module.exports = run;
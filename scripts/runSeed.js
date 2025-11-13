// scripts/runSeed.js
const sequelize = require('../models');
const seedData = require('./seedData');

const runSeed = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected...');
    
    await seedData();
    process.exit(0);
  } catch (error) {
    console.error('Unable to run seed:', error);
    process.exit(1);
  }
};

runSeed();
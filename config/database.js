const path = require('path');

module.exports = {
  development: {
    storage: path.join(__dirname, '..', 'database.sqlite'),
    dialect: 'sqlite',
    logging: console.log
  },
  test: {
    storage: ':memory:',
    dialect: 'sqlite',
    logging: false
  },
  production: {
    storage: path.join(__dirname, '..', 'database.sqlite'),
    dialect: 'sqlite',
    logging: false
  }
};
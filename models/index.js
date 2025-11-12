// models/index.js
const { Sequelize } = require('sequelize');
const config = require('../config/database');

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Importar modelos
db.User = require('./User')(sequelize, Sequelize.DataTypes);
db.Category = require('./Category')(sequelize, Sequelize.DataTypes);
db.Tag = require('./Tag')(sequelize, Sequelize.DataTypes);
db.Product = require('./Product')(sequelize, Sequelize.DataTypes);

// Definir relaciones
if (db.Product && db.Category) {
  db.Product.belongsTo(db.Category);
  db.Category.hasMany(db.Product);
}

if (db.Product && db.Tag) {
  db.Product.belongsToMany(db.Tag, { through: 'ProductTags' });
  db.Tag.belongsToMany(db.Product, { through: 'ProductTags' });
}

module.exports = db;
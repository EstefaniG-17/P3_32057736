const { Sequelize } = require('sequelize');
const config = require('../config/database');

// Usar la instancia de sequelize exportada por config/database si está disponible
const env = process.env.NODE_ENV || 'development';
let sequelize;
if (config && config.sequelize) {
  sequelize = config.sequelize;
} else {
  const dbConfig = config[env];
  sequelize = new Sequelize({
    dialect: dbConfig.dialect,
    storage: dbConfig.storage,
    logging: dbConfig.logging
  });
}

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Importar modelos
db.User = require('./User')(sequelize, Sequelize.DataTypes);
db.Category = require('./Category')(sequelize, Sequelize.DataTypes);
db.Tag = require('./Tag')(sequelize, Sequelize.DataTypes);
db.Product = require('./Product')(sequelize, Sequelize.DataTypes);

// Definir relaciones
db.Product.belongsTo(db.Category, { 
  foreignKey: 'categoryId',
  as: 'category'
});
db.Category.hasMany(db.Product, { 
  foreignKey: 'categoryId',
  as: 'products'
});

db.Product.belongsToMany(db.Tag, { 
  through: 'ProductTags',
  foreignKey: 'productId',
  otherKey: 'tagId',
  as: 'tags'
});
db.Tag.belongsToMany(db.Product, { 
  through: 'ProductTags',
  foreignKey: 'tagId',
  otherKey: 'productId',
  as: 'products'
});

module.exports = db;
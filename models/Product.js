const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    // ✅ ATRIBUTOS PERSONALIZADOS PARA LIBROS MAZE RUNNER
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'James Dashner'
    },
    isbn: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    publicationYear: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    publisher: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'V&R Editoras'
    },
    language: {
      type: DataTypes.STRING,
      defaultValue: 'Español'
    },
    pages: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    format: {
      type: DataTypes.ENUM('Tapa blanda', 'Tapa dura', 'E-book'),
      defaultValue: 'Tapa blanda'
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'products',
    timestamps: true,
    hooks: {
      beforeValidate: (product) => {
        if (product.name && !product.slug) {
          product.slug = product.name
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
        }
      }
    }
  });

  return Product;
};
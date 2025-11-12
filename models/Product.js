// models/product.js
module.exports = (sequelize, DataTypes) => {
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
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    // Atributos personalizados para libros de Maze Runner
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
      allowNull: false
    },
    edition: {
      type: DataTypes.STRING,
      allowNull: true
    },
    language: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'English'
    },
    pageCount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    coverType: {
      type: DataTypes.ENUM('Hardcover', 'Paperback', 'E-book'),
      allowNull: false
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ageRange: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  return Product;
};
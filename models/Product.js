module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    stock: { type: DataTypes.INTEGER, defaultValue: 0 },
    // Campos para libros y productos editoriales
    author: { type: DataTypes.STRING },
    isbn: { type: DataTypes.STRING },
    publicationYear: { type: DataTypes.INTEGER },
    publisher: { type: DataTypes.STRING },
    language: { type: DataTypes.STRING },
    pages: { type: DataTypes.INTEGER },
    format: { type: DataTypes.STRING },
    isAvailable: { type: DataTypes.BOOLEAN, defaultValue: true },
    sku: { type: DataTypes.STRING },
    slug: { type: DataTypes.STRING, unique: true }
  }, {
    tableName: 'products',
    timestamps: true
  });

  // Generar slug automático
  Product.beforeSave(async (product) => {
    if (product.name) {
      let slugBase = product.name.toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      if (product.sku) {
        const skuPart = String(product.sku).toLowerCase().replace(/[^a-z0-9-]/g, '-');
        slugBase = `${slugBase}-${skuPart}`;
      }
      // Si existe ISBN (libros) y no hay SKU, añadir parte del ISBN para mejorar unicidad
      if (product.isbn && !product.sku) {
        const isbnPart = String(product.isbn).toLowerCase().replace(/[^a-z0-9-]/g, '-').slice(0, 8);
        slugBase = `${slugBase}-${isbnPart}`;
      }
      product.slug = slugBase;
    }
  });

  return Product;
};
const { Product, Category, Tag, sequelize } = require('../models');

(async () => {
  try {
    await sequelize.authenticate();
    const products = await Product.findAll({ include: [{ model: Category, as: 'category' }, { model: Tag, as: 'tags' }] });
    console.log(`Found ${products.length} products:`);
    products.forEach(p => {
      console.log({
        id: p.id,
        name: p.name,
        sku: p.sku,
        categoryId: p.CategoryId,
        category: p.category && p.category.name,
        author: p.author,
        isbn: p.isbn,
        format: p.format,
        edition: p.edition,
        character: p.character,
        movie: p.movie,
        isAvailable: p.isAvailable,
        price: p.price
      });
    });
    process.exit(0);
  } catch (err) {
    console.error('Error listing products:', err && err.stack ? err.stack : err);
    process.exit(1);
  }
})();

const { Category, Tag, sequelize } = require('../models');

(async () => {
  try {
    await sequelize.authenticate();
    const categories = await Category.findAll();
    const tags = await Tag.findAll();
    console.log(`Found ${categories.length} categories:`);
    categories.forEach(c => console.log({ id: c.id, name: c.name, description: c.description }));
    console.log(`Found ${tags.length} tags:`);
    tags.forEach(t => console.log({ id: t.id, name: t.name }));
    process.exit(0);
  } catch (err) {
    console.error('Error listing categories/tags:', err && err.stack ? err.stack : err);
    process.exit(1);
  }
})();

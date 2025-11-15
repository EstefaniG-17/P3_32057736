const { Product, Category, Tag, sequelize } = require('../models');
const ProductQueryBuilder = require('../services/ProductQueryBuilder');

class ProductRepository {
  async findAll() {
    return await Product.findAll({
      include: [
        { model: Category, as: 'category' },
        { model: Tag, as: 'tags' }
      ]
    });
  }

  async findById(id) {
    return await Product.findByPk(id, {
      include: [
        { model: Category, as: 'category' },
        { model: Tag, as: 'tags' }
      ]
    });
  }

  async findBySlug(slug) {
    return await Product.findOne({ 
      where: { slug },
      include: [
        { model: Category, as: 'category' },
        { model: Tag, as: 'tags' }
      ]
    });
  }

  async create(productData) {
    const product = await Product.create(productData);
    
    if (productData.tagIds && productData.tagIds.length > 0) {
      await product.addTags(productData.tagIds);
    }
    
    return await this.findById(product.id);
  }

  async update(id, productData) {
    const product = await Product.findByPk(id);
    if (!product) return null;
    
    await product.update(productData);
    
    if (productData.tagIds) {
      await product.setTags(productData.tagIds);
    }
    
    return await this.findById(id);
  }

  async delete(id) {
    const product = await Product.findByPk(id);
    if (!product) return false;
    
    await product.destroy();
    return true;
  }

  async findAllWithFilters(filters) {
    const queryBuilder = new ProductQueryBuilder(Product, sequelize);

    // Aplicar filtros (mapeo a métodos del query builder)
    if (filters.page) queryBuilder.paginate(filters.page, filters.limit);
    if (filters.category) queryBuilder.filterByCategory(filters.category);
    if (filters.tags) queryBuilder.filterByTags(filters.tags);
    if (filters.price_min || filters.price_max) queryBuilder.filterByPrice(filters.price_min, filters.price_max);
    if (filters.search) queryBuilder.search(filters.search);
    if (filters.author) queryBuilder.filterByAuthor(filters.author);
    if (filters.publisher) queryBuilder.filterByPublisher(filters.publisher);
    if (filters.format) queryBuilder.filterByFormat(filters.format);
    // soportar otros filtros de forma segura
    if (filters.platform) queryBuilder.filterByPlatform && queryBuilder.filterByPlatform(filters.platform);
    if (filters.developer) queryBuilder.filterByDeveloper && queryBuilder.filterByDeveloper(filters.developer);
    if (filters.genre) queryBuilder.filterByGenre && queryBuilder.filterByGenre(filters.genre);
    if (filters.multiplayer !== undefined) queryBuilder.filterByMultiplayer && queryBuilder.filterByMultiplayer(filters.multiplayer);

    return await queryBuilder.execute();
  }
}

module.exports = new ProductRepository();
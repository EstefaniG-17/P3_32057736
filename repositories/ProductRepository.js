const ProductQueryBuilder = require('../services/ProductQueryBuilder');

class ProductRepository {
  constructor(models, sequelize) {
    this.Product = models.Product;
    this.Category = models.Category;
    this.Tag = models.Tag;
    this.sequelize = sequelize;
  }

  async findAllWithFilters(filters = {}) {
    const queryBuilder = new ProductQueryBuilder(this.Product, this.sequelize);
    
    const result = await queryBuilder
      .withCategory()
      .withTags()
      .filterByPrice(filters.price_min, filters.price_max)
      .filterByCategory(filters.category)
      .filterByTags(filters.tags)
      .search(filters.search)
      // ✅ FILTROS PERSONALIZADOS
      .filterByAuthor(filters.author)
      .filterByPublisher(filters.publisher)
      .filterByFormat(filters.format)
      .filterByLanguage(filters.language)
      .filterByPublicationYear(filters.publicationYear)
      .filterByAvailable(filters.available)
      .paginate(filters.page, filters.limit)
      .execute();

    return result;
  }

  async findById(id) {
    return await this.Product.findByPk(id, {
      include: [
        { model: this.Category, as: 'category' },
        { model: this.Tag, as: 'tags' }
      ]
    });
  }

  async findBySlug(slug) {
    return await this.Product.findOne({
      where: { slug },
      include: [
        { model: this.Category, as: 'category' },
        { model: this.Tag, as: 'tags' }
      ]
    });
  }

  async create(productData) {
    return await this.Product.create(productData);
  }

  async update(id, productData) {
    const product = await this.Product.findByPk(id);
    if (!product) return null;
    
    return await product.update(productData);
  }

  async delete(id) {
    const product = await this.Product.findByPk(id);
    if (!product) return null;
    
    await product.destroy();
    return true;
  }
}

module.exports = ProductRepository;
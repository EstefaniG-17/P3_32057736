// repositories/ProductRepository.js - NUEVO ARCHIVO (nueva carpeta)
const { Product, Category, Tag } = require('../models');

class ProductRepository {
  constructor() {
    this.model = Product;
  }

  async findAllWithFilters(queryOptions = {}) {
    return await this.model.findAndCountAll(queryOptions);
  }

  async findById(id) {
    return await this.model.findByPk(id, {
      include: [
        { model: Category, as: 'category' },
        { model: Tag, as: 'tags', through: { attributes: [] } }
      ]
    });
  }

  async create(productData) {
    // Accept both `tags` or `tagIds`, and `CategoryId` or `categoryId` from clients
    const { tags, tagIds, CategoryId, categoryId, ...rest } = productData;
    const resolvedCategoryId = CategoryId || categoryId || rest.CategoryId || rest.categoryId || null;
    const product = await this.model.create({ ...rest, CategoryId: resolvedCategoryId });

    const tagArray = Array.isArray(tags) ? tags : Array.isArray(tagIds) ? tagIds : [];
    if (tagArray.length > 0) {
      await product.setTags(tagArray);
    }

    return await this.findById(product.id);
  }

  async update(id, productData) {
    const product = await this.findById(id);
    if (!product) return null;
    const { tags, tagIds, CategoryId, categoryId, ...rest } = productData;
    const resolvedCategoryId = CategoryId || categoryId || rest.CategoryId || rest.categoryId || undefined;
    await product.update({ ...rest, CategoryId: resolvedCategoryId });
    const tagArray = Array.isArray(tags) ? tags : Array.isArray(tagIds) ? tagIds : null;
    if (Array.isArray(tagArray)) {
      await product.setTags(tagArray);
    }
    return await this.findById(id);
  }

  async delete(id) {
    const product = await this.findById(id);
    if (!product) return null;
    
    await product.destroy();
    return true;
  }
}

module.exports = ProductRepository;
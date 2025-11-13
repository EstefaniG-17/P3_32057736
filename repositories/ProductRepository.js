// repositories/ProductRepository.js
class ProductRepository {
  constructor(models) {
    this.Product = models.Product;
    this.Category = models.Category;
    this.Tag = models.Tag;
  }

  // Builder para consultas avanzadas
  buildQuery(filters = {}) {
    const {
      page = 1,
      limit = 10,
      category,
      tags,
      price_min,
      price_max,
      search,
      publisher,
      coverType,
      language,
      genre,
      ageRange,
      publicationYear
    } = filters;

    const offset = (page - 1) * limit;
    const where = {};
    const include = [];

    // Filtro por categoría
    if (category) {
      include.push({
        model: this.Category,
        where: { 
          [Op.or]: [
            { id: category },
            { name: { [Op.like]: `%${category}%` } }
          ]
        },
        required: true
      });
    }

    // Filtro por tags
    if (tags) {
      const tagIds = Array.isArray(tags) ? tags : tags.split(',');
      include.push({
        model: this.Tag,
        where: { id: { [Op.in]: tagIds } },
        required: true
      });
    }

    // Filtro por rango de precio
    if (price_min || price_max) {
      where.price = {};
      if (price_min) where.price[Op.gte] = parseFloat(price_min);
      if (price_max) where.price[Op.lte] = parseFloat(price_max);
    }

    // Búsqueda en nombre y descripción
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    // Filtros personalizados para libros
    if (publisher) where.publisher = { [Op.like]: `%${publisher}%` };
    if (coverType) where.coverType = coverType;
    if (language) where.language = language;
    if (genre) where.genre = { [Op.like]: `%${genre}%` };
    if (ageRange) where.ageRange = ageRange;
    if (publicationYear) where.publicationYear = publicationYear;

    return {
      where,
      include: [
        ...include,
        {
          model: this.Category,
          attributes: ['id', 'name']
        },
        {
          model: this.Tag,
          attributes: ['id', 'name'],
          through: { attributes: [] }
        }
      ],
      limit: parseInt(limit),
      offset: offset,
      order: [['createdAt', 'DESC']]
    };
  }

  async findWithFilters(filters = {}) {
    const queryOptions = this.buildQuery(filters);
    return await this.Product.findAndCountAll(queryOptions);
  }

  async findById(id) {
    return await this.Product.findByPk(id, {
      include: [
        {
          model: this.Category,
          attributes: ['id', 'name']
        },
        {
          model: this.Tag,
          attributes: ['id', 'name'],
          through: { attributes: [] }
        }
      ]
    });
  }

  async findBySlug(slug) {
    return await this.Product.findOne({
      where: { slug },
      include: [
        {
          model: this.Category,
          attributes: ['id', 'name']
        },
        {
          model: this.Tag,
          attributes: ['id', 'name'],
          through: { attributes: [] }
        }
      ]
    });
  }

  async create(productData) {
    return await this.Product.create(productData);
  }

  async update(id, productData) {
    const product = await this.findById(id);
    if (!product) return null;
    
    return await product.update(productData);
  }

  async delete(id) {
    const product = await this.findById(id);
    if (!product) return null;
    
    await product.destroy();
    return true;
  }
}

module.exports = ProductRepository;
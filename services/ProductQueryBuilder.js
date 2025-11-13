const { Op } = require('sequelize');

class ProductQueryBuilder {
  constructor(ProductModel, sequelize) {
    this.Product = ProductModel;
    this.sequelize = sequelize;
    this.queryOptions = {
      include: [],
      where: {},
      limit: 10,
      offset: 0
    };
  }

  withCategory() {
    this.queryOptions.include.push({
      model: this.sequelize.models.Category,
      as: 'category',
      attributes: ['id', 'name', 'description']
    });
    return this;
  }

  withTags() {
    this.queryOptions.include.push({
      model: this.sequelize.models.Tag,
      as: 'tags',
      through: { attributes: [] },
      attributes: ['id', 'name']
    });
    return this;
  }

  filterByPrice(min, max) {
    if (min || max) {
      this.queryOptions.where.price = {};
      if (min) this.queryOptions.where.price[Op.gte] = parseFloat(min);
      if (max) this.queryOptions.where.price[Op.lte] = parseFloat(max);
    }
    return this;
  }

  filterByCategory(categoryId) {
    if (categoryId) {
      this.queryOptions.where.categoryId = parseInt(categoryId);
    }
    return this;
  }

  filterByTags(tagIds) {
    if (tagIds) {
      const tagArray = Array.isArray(tagIds) ? tagIds : tagIds.split(',');
      this.queryOptions.include.push({
        model: this.sequelize.models.Tag,
        as: 'tagsFilter',
        through: { attributes: [] },
        where: { id: { [Op.in]: tagArray.map(id => parseInt(id)) } },
        attributes: [],
        required: true
      });
    }
    return this;
  }

  search(searchTerm) {
    if (searchTerm) {
      this.queryOptions.where[Op.or] = [
        { name: { [Op.like]: `%${searchTerm}%` } },
        { description: { [Op.like]: `%${searchTerm}%` } },
        { author: { [Op.like]: `%${searchTerm}%` } }
      ];
    }
    return this;
  }

  // ✅ FILTROS PERSONALIZADOS PARA LIBROS
  filterByAuthor(author) {
    if (author) {
      this.queryOptions.where.author = { [Op.like]: `%${author}%` };
    }
    return this;
  }

  filterByPublisher(publisher) {
    if (publisher) {
      this.queryOptions.where.publisher = { [Op.like]: `%${publisher}%` };
    }
    return this;
  }

  filterByFormat(format) {
    if (format) {
      this.queryOptions.where.format = format;
    }
    return this;
  }

  filterByLanguage(language) {
    if (language) {
      this.queryOptions.where.language = language;
    }
    return this;
  }

  filterByPublicationYear(year) {
    if (year) {
      this.queryOptions.where.publicationYear = parseInt(year);
    }
    return this;
  }

  filterByAvailable(available) {
    if (available !== undefined) {
      this.queryOptions.where.isAvailable = available === 'true';
    }
    return this;
  }

  paginate(page = 1, limit = 10) {
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    this.queryOptions.limit = limitNum;
    this.queryOptions.offset = (pageNum - 1) * limitNum;
    return this;
  }

  async execute() {
    // Clonar options para count (sin paginación)
    const countOptions = {
      where: this.queryOptions.where,
      include: [...this.queryOptions.include]
    };

    // Remover where de includes para count
    countOptions.include = countOptions.include.map(include => {
      const { where, ...rest } = include;
      return rest;
    });

    const products = await this.Product.findAll(this.queryOptions);
    const total = await this.Product.count(countOptions);

    return {
      products,
      pagination: {
        total,
        page: Math.floor(this.queryOptions.offset / this.queryOptions.limit) + 1,
        limit: this.queryOptions.limit,
        totalPages: Math.ceil(total / this.queryOptions.limit)
      }
    };
  }
}

module.exports = ProductQueryBuilder;
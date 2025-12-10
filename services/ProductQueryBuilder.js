// services/ProductQueryBuilder.js - NUEVO ARCHIVO (nueva carpeta)
const { Op } = require('sequelize');
const { Category, Tag } = require('../models');

class ProductQueryBuilder {
  constructor() {
    this.queryOptions = {
      where: {},
      include: [
        { model: Category, as: 'category' },
        { model: Tag, as: 'tags', through: { attributes: [] } }
      ]
    };
  }

  withPagination(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    this.queryOptions.limit = parseInt(limit);
    this.queryOptions.offset = offset;
    return this;
  }

  withCategory(category) {
    if (category) {
      this.queryOptions.include[0].where = {
        [Op.or]: [
          { id: category },
          { name: { [Op.like]: `%${category}%` } }
        ]
      };
      this.queryOptions.include[0].required = true;
    }
    return this;
  }

  withTags(tags) {
    if (tags) {
      const tagIds = tags.split(',').map(id => parseInt(id.trim()));
      this.queryOptions.include[1].where = { id: { [Op.in]: tagIds } };
      this.queryOptions.include[1].required = true;
    }
    return this;
  }

  withPriceRange(minPrice, maxPrice) {
    if (minPrice || maxPrice) {
      this.queryOptions.where.price = {};
      if (minPrice) this.queryOptions.where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) this.queryOptions.where.price[Op.lte] = parseFloat(maxPrice);
    }
    return this;
  }

  withSearch(search) {
    if (search) {
      this.queryOptions.where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }
    return this;
  }

  // Filtros orientados a productos tipo libro
  withAuthor(author) {
    if (author) {
      this.queryOptions.where.author = { [Op.like]: `%${author}%` };
      this.queryOptions.include = this.queryOptions.include || [];
    }
    return this;
  }

  withISBN(isbn) {
    if (isbn) {
      this.queryOptions.where.isbn = { [Op.like]: `%${isbn}%` };
    }
    return this;
  }

  withPublicationYear(minYear, maxYear) {
    if (minYear || maxYear) {
      this.queryOptions.where.publicationYear = {};
      if (minYear) this.queryOptions.where.publicationYear[Op.gte] = parseInt(minYear);
      if (maxYear) this.queryOptions.where.publicationYear[Op.lte] = parseInt(maxYear);
    }
    return this;
  }

  withPublisher(publisher) {
    if (publisher) {
      this.queryOptions.where.publisher = { [Op.like]: `%${publisher}%` };
    }
    return this;
  }

  withLanguage(language) {
    if (language) {
      this.queryOptions.where.language = { [Op.like]: `%${language}%` };
    }
    return this;
  }

  withPages(minPages, maxPages) {
    if (minPages || maxPages) {
      this.queryOptions.where.pages = {};
      if (minPages) this.queryOptions.where.pages[Op.gte] = parseInt(minPages);
      if (maxPages) this.queryOptions.where.pages[Op.lte] = parseInt(maxPages);
    }
    return this;
  }

  withFormat(format) {
    if (format) {
      this.queryOptions.where.format = { [Op.like]: `%${format}%` };
    }
    return this;
  }

  withAvailability(isAvailable) {
    if (typeof isAvailable !== 'undefined') {
      if (isAvailable === 'true' || isAvailable === true) this.queryOptions.where.isAvailable = true;
      else if (isAvailable === 'false' || isAvailable === false) this.queryOptions.where.isAvailable = false;
    }
    return this;
  }


  build() {
    return this.queryOptions;
  }
}

module.exports = ProductQueryBuilder;
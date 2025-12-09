const { Op } = require('sequelize');
const { Product, Category, Tag } = require('../models');

class ProductQueryBuilder {
  constructor() {
    this.query = {
      where: {},
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'description']
        },
        {
          model: Tag,
          as: 'tags',
          through: { attributes: [] },
          attributes: ['id', 'name']
        }
      ],
      distinct: true
    };
  }

  hasField(field) {
    return !!(Product && Product.rawAttributes && Product.rawAttributes[field]);
  }

  paginate(page = 1, limit = 10) {
    const p = parseInt(page, 10) || 1;
    let l = parseInt(limit, 10) || 10;
    if (l <= 0) l = 10; // safeguard: avoid division by zero or invalid limits
    const offset = (p - 1) * l;
    this.query.offset = offset;
    this.query.limit = l;
    return this;
  }

  filterByCategory(category) {
    if (category) {
      this.query.include[0].where = {
        [Op.or]: [
          { id: category },
          { name: { [Op.like]: `%${category}%` } }
        ]
      };
    }
    return this;
  }

  filterByTags(tags) {
    if (tags) {
      const tagIds = Array.isArray(tags) ? tags : String(tags).split(',');
      const parsed = tagIds.map(t => parseInt(t, 10)).filter(n => !Number.isNaN(n));
      if (parsed.length > 0) this.query.include[1].where = { id: { [Op.in]: parsed } };
    }
    return this;
  }

  filterByPriceRange(minPrice, maxPrice) {
    if (minPrice !== undefined || maxPrice !== undefined) {
      this.query.where.price = this.query.where.price || {};
      if (minPrice !== undefined && minPrice !== null && String(minPrice) !== '') this.query.where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice !== undefined && maxPrice !== null && String(maxPrice) !== '') this.query.where.price[Op.lte] = parseFloat(maxPrice);
    }
    return this;
  }

  // convenience alias used by repository
  filterByPrice(minPrice, maxPrice) {
    return this.filterByPriceRange(minPrice, maxPrice);
  }

  search(searchTerm) {
    if (searchTerm) {
      const conds = [
        { name: { [Op.like]: `%${searchTerm}%` } },
        { description: { [Op.like]: `%${searchTerm}%` } },
        { author: { [Op.like]: `%${searchTerm}%` } }
      ];
      this.query.where[Op.or] = this.query.where[Op.or] ? this.query.where[Op.or].concat(conds) : conds;
    }
    return this;
  }

  filterByAuthor(author) {
    if (author) this.query.where.author = { [Op.like]: `%${author}%` };
    return this;
  }

  filterByPublisher(publisher) {
    if (publisher) this.query.where.publisher = { [Op.like]: `%${publisher}%` };
    return this;
  }

  filterByFormat(format) {
    if (format) this.query.where.format = { [Op.like]: `%${format}%` };
    return this;
  }

  filterByPublicationYear(publicationYear) {
    if (publicationYear !== undefined && publicationYear !== null && String(publicationYear) !== '') this.query.where.publicationYear = parseInt(publicationYear, 10);
    return this;
  }

  filterByLanguage(language) {
    if (language) this.query.where.language = { [Op.like]: `%${language}%` };
    return this;
  }

  filterByPlatform(platform) {
    if (platform && this.hasField('platform')) this.query.where.platform = { [Op.like]: `%${platform}%` };
    return this;
  }

  filterByDeveloper(developer) {
    if (developer && this.hasField('developer')) this.query.where.developer = { [Op.like]: `%${developer}%` };
    return this;
  }

  filterByGenre(genre) {
    if (genre && this.hasField('genre')) this.query.where.genre = { [Op.like]: `%${genre}%` };
    return this;
  }

  filterByMultiplayer(multiplayer) {
    if (multiplayer !== undefined && this.hasField('multiplayer')) {
      this.query.where.multiplayer = String(multiplayer) === 'true';
    }
    return this;
  }

  filterByCoverType(coverType) {
    if (coverType) this.query.where.coverType = coverType;
    return this;
  }

  filterBySeriesNumber(seriesNumber) {
    if (seriesNumber) this.query.where.seriesNumber = parseInt(seriesNumber, 10);
    return this;
  }

  build() {
    return this.query;
  }

  async execute() {
    const { rows, count } = await Product.findAndCountAll(this.build());

    let total = 0;
    if (typeof count === 'number') total = count;
    else if (Array.isArray(count)) {
      if (count.length > 0 && count[0] && count[0].count !== undefined) total = parseInt(count[0].count, 10);
      else total = count.length;
    }

    const limit = this.query.limit ? parseInt(this.query.limit, 10) : 10;
    const offset = this.query.offset ? parseInt(this.query.offset, 10) : 0;
    const page = Math.floor(offset / limit) + 1;

    return {
      products: rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: limit ? Math.ceil(total / limit) : 1
      }
    };
  }
}

module.exports = ProductQueryBuilder;
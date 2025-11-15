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
    const offset = (page - 1) * limit;
    this.query.offset = offset;
    this.query.limit = parseInt(limit);
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
      const tagIds = Array.isArray(tags) ? tags : tags.split(',');
      this.query.include[1].where = { id: { [Op.in]: tagIds } };
    }
    return this;
  }

  filterByPriceRange(minPrice, maxPrice) {
    if (minPrice || maxPrice) {
      this.query.where.price = {};
      if (minPrice) this.query.where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) this.query.where.price[Op.lte] = parseFloat(maxPrice);
    }
    return this;
  }

  search(searchTerm) {
    if (searchTerm) {
      this.query.where[Op.or] = [
        { name: { [Op.like]: `%${searchTerm}%` } },
        { description: { [Op.like]: `%${searchTerm}%` } }
      ];
    }
    return this;
  }

  filterByPlatform(platform) {
    if (platform) {
      if (this.hasField('platform')) {
        this.query.where.platform = { [Op.like]: `%${platform}%` };
      }
    }
    return this;
  }

  filterByDeveloper(developer) {
    if (developer) {
      if (this.hasField('developer')) {
        this.query.where.developer = { [Op.like]: `%${developer}%` };
      }
    }
    return this;
  }

  filterByGenre(genre) {
    if (genre) {
      if (this.hasField('genre')) {
        this.query.where.genre = { [Op.like]: `%${genre}%` };
      }
    }
    return this;
  }

  filterByMultiplayer(multiplayer) {
    if (multiplayer !== undefined) {
      if (this.hasField('multiplayer')) {
        this.query.where.multiplayer = multiplayer === 'true';
      }
    }
    return this;
  }

  build() {
    return this.query;
  }

  async execute() {
    const result = await Product.findAndCountAll(this.build());
    const rows = result.rows || result;
    const count = typeof result.count === 'number' ? result.count : (result.count && result.count.length) ? result.count[0] : 0;

    const limit = this.query.limit || 10;
    const offset = this.query.offset || 0;
    const page = Math.floor(offset / limit) + 1;

    return {
      products: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  // En services/ProductQueryBuilder.js - Agregar estos métodos:

filterByAuthor(author) {
  if (author) {
    this.query.where.author = { [Op.like]: `%${author}%` };
  }
  return this;
}

filterByPublisher(publisher) {
  if (publisher) {
    this.query.where.publisher = { [Op.like]: `%${publisher}%` };
  }
  return this;
}

filterByCoverType(coverType) {
  if (coverType) {
    this.query.where.coverType = coverType;
  }
  return this;
}

filterBySeriesNumber(seriesNumber) {
  if (seriesNumber) {
    this.query.where.seriesNumber = parseInt(seriesNumber);
  }
  return this;
}

filterByPublicationYear(publicationYear) {
  if (publicationYear) {
    this.query.where.publicationYear = parseInt(publicationYear);
  }
  return this;
}

filterByLanguage(language) {
  if (language) {
    this.query.where.language = { [Op.like]: `%${language}%` };
  }
  return this;
}

// Alias / convenience methods expected by repository
filterByPrice(minPrice, maxPrice) {
  return this.filterByPriceRange(minPrice, maxPrice);
}

filterByFormat(format) {
  if (format) {
    this.query.where.format = { [Op.like]: `%${format}%` };
  }
  return this;
}
}

module.exports = ProductQueryBuilder;
const { Op } = require('sequelize');
const { Product, Category, Tag } = require('../models');

// Determinar operador LIKE adecuado según el dialecto (SQLite no tiene ILIKE)
const DIALECT = (Product && Product.sequelize && Product.sequelize.getDialect && Product.sequelize.getDialect()) || 'sqlite';
const LIKE_OP = DIALECT === 'sqlite' ? Op.like : (Op.iLike || Op.like);

class ProductQueryBuilder {
  constructor() {
    this.query = {
      // CLAVE: where debe ser undefined inicialmente
      where: undefined,
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

  // Método para inicializar where solo cuando sea necesario
  ensureWhere() {
    if (!this.query.where) {
      this.query.where = {};
    }
    return this;
  }

  hasField(field) {
    return !!(Product && Product.rawAttributes && Product.rawAttributes[field]);
  }

  paginate(page = 1, limit = 10) {
    const p = parseInt(page, 10) || 1;
    let l = parseInt(limit, 10) || 10;
    if (l <= 0) l = 10;
    const offset = (p - 1) * l;
    this.query.offset = offset;
    this.query.limit = l;
    return this;
  }

  filterByCategory(category) {
    if (category !== undefined && category !== null && String(category).trim() !== '') {
      // Si category es numérico, compararlo por id, si no, por nombre (like)
      const maybeId = parseInt(category, 10);
      if (!Number.isNaN(maybeId)) {
        this.query.include[0].where = { id: maybeId };
      } else {
        const like = LIKE_OP;
        this.query.include[0].where = { name: { [like]: `%${String(category).trim()}%` } };
      }
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
      this.ensureWhere();
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
    if (searchTerm !== undefined && searchTerm !== null && String(searchTerm).trim() !== '') {
      this.ensureWhere();
      const like = LIKE_OP;
      const st = String(searchTerm).trim();
      const conds = [
        { name: { [like]: `%${st}%` } },
        { description: { [like]: `%${st}%` } },
        { author: { [like]: `%${st}%` } }
      ];
      this.query.where[Op.or] = this.query.where[Op.or] ? this.query.where[Op.or].concat(conds) : conds;
    }
    return this;
  }

  filterByAuthor(author) {
    if (author !== undefined && author !== null && String(author).trim() !== '') {
      this.ensureWhere();
      const like = LIKE_OP;
      this.query.where.author = { [like]: `%${String(author).trim()}%` };
    }
    return this;
  }

  filterByPublisher(publisher) {
    if (publisher !== undefined && publisher !== null && String(publisher).trim() !== '') {
      this.ensureWhere();
      const like = LIKE_OP;
      this.query.where.publisher = { [like]: `%${String(publisher).trim()}%` };
    }
    return this;
  }

  filterByFormat(format) {
    if (format !== undefined && format !== null && String(format).trim() !== '') {
      this.ensureWhere();
      const like = LIKE_OP;
      this.query.where.format = { [like]: `%${String(format).trim()}%` };
    }
    return this;
  }

  filterByPublicationYear(publicationYear) {
    if (publicationYear !== undefined && publicationYear !== null && String(publicationYear) !== '') {
      this.ensureWhere();
      this.query.where.publicationYear = parseInt(publicationYear, 10);
    }
    return this;
  }

  filterByLanguage(language) {
    if (language !== undefined && language !== null && String(language).trim() !== '') {
      this.ensureWhere();
      const like = LIKE_OP;
      this.query.where.language = { [like]: `%${String(language).trim()}%` };
    }
    return this;
  }

  filterByPlatform(platform) {
    if (platform && this.hasField('platform')) {
      this.ensureWhere();
      this.query.where.platform = { [Op.like]: `%${platform}%` };
    }
    return this;
  }

  filterByDeveloper(developer) {
    if (developer && this.hasField('developer')) {
      this.ensureWhere();
      this.query.where.developer = { [Op.like]: `%${developer}%` };
    }
    return this;
  }

  filterByGenre(genre) {
    if (genre && this.hasField('genre')) {
      this.ensureWhere();
      this.query.where.genre = { [Op.like]: `%${genre}%` };
    }
    return this;
  }

  filterByMultiplayer(multiplayer) {
    if (multiplayer !== undefined && this.hasField('multiplayer')) {
      this.ensureWhere();
      this.query.where.multiplayer = String(multiplayer) === 'true';
    }
    return this;
  }

  filterByCoverType(coverType) {
    if (coverType) {
      this.ensureWhere();
      this.query.where.coverType = coverType;
    }
    return this;
  }

  filterBySeriesNumber(seriesNumber) {
    if (seriesNumber) {
      this.ensureWhere();
      this.query.where.seriesNumber = parseInt(seriesNumber, 10);
    }
    return this;
  }

  build() {
    return this.query;
  }

  async execute() {
    console.log('\n=== ProductQueryBuilder.execute() ===');
    console.log('WHERE condition:', this.query.where);
    console.log('Query completa para Sequelize:', JSON.stringify({
      where: this.query.where,
      include: this.query.include ? '...' : 'none',
      limit: this.query.limit,
      offset: this.query.offset
    }, null, 2));
    // Si no hay condiciones WHERE, ni filtros en los includes, y no hay paginación,
    // devolver todos los productos con findAll para evitar problemas con joins y conteos.
    const includeHasWhere = Array.isArray(this.query.include) && this.query.include.some(i => i && i.where);
    const hasWhere = !!this.query.where;
    const hasPagination = (this.query.limit !== undefined && this.query.limit !== null) || (this.query.offset !== undefined && this.query.offset !== null);

    if (!hasWhere && !includeHasWhere && !hasPagination) {
      const rows = await Product.findAll(this.build());
      console.log('Resultado de findAll (sin filtros ni paginación):');
      console.log(`- Filas encontradas: ${rows.length}`);

      return {
        products: rows,
        pagination: {
          total: rows.length,
          page: 1,
          limit: rows.length,
          totalPages: 1
        }
      };
    }

    // Cuando hay includes y paginación, desactivar subQuery para evitar
    // que Sequelize genere subconsultas que devuelvan filas vacías.
    if (this.query.limit && Array.isArray(this.query.include) && this.query.include.length > 0) {
      this.query.subQuery = false;
    }

    const { rows, count } = await Product.findAndCountAll(this.build());

    console.log('Resultado de findAndCountAll:');
    console.log(`- Filas encontradas: ${rows.length}`);
    console.log(`- Conteo total: ${count}`);

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
const { Product, Category, Tag, sequelize } = require('../models');
const ProductRepository = require('../repositories/ProductRepository');

// ✅ USAR REPOSITORY PATTERN
const productRepository = new ProductRepository({ Product, Category, Tag }, sequelize);

const productController = {
  search: async (req, res) => {
    try {
      const filters = req.query;
      const result = await productRepository.findAllWithFilters(filters);
      
      res.json({
        status: 'success',
        data: result.products,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  },

  getBySlug: async (req, res) => {
    try {
      const { id, slug } = req.params;
      const product = await productRepository.findById(id);

      if (!product) {
        return res.status(404).json({
          status: 'error',
          message: 'Product not found'
        });
      }

      // ✅ SELF-HEALING: Redirección 301 real
      if (product.slug !== slug) {
        return res.redirect(301, `/p/${id}-${product.slug}`);
      }

      res.json({
        status: 'success',
        data: product
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await productRepository.findById(id);

      if (!product) {
        return res.status(404).json({
          status: 'error',
          message: 'Product not found'
        });
      }

      res.json({
        status: 'success',
        data: product
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  },

  create: async (req, res) => {
    try {
      const productData = {
        ...req.body,
        // Generar slug si no viene
        slug: req.body.slug || req.body.name.toLowerCase().replace(/\s+/g, '-')
      };

      const product = await productRepository.create(productData);
      
      // Si hay tags, asociarlos
      if (req.body.tags && Array.isArray(req.body.tags)) {
        await product.setTags(req.body.tags);
      }

      const productWithRelations = await productRepository.findById(product.id);

      res.status(201).json({
        status: 'success',
        data: productWithRelations
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const productData = { ...req.body };

      // Generar nuevo slug si el nombre cambió
      if (req.body.name && !req.body.slug) {
        productData.slug = req.body.name.toLowerCase().replace(/\s+/g, '-');
      }

      const product = await productRepository.update(id, productData);
      
      if (!product) {
        return res.status(404).json({
          status: 'error',
          message: 'Product not found'
        });
      }

      // Actualizar tags si vienen en la request
      if (req.body.tags && Array.isArray(req.body.tags)) {
        await product.setTags(req.body.tags);
      }

      const productWithRelations = await productRepository.findById(id);

      res.json({
        status: 'success',
        data: productWithRelations
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await productRepository.delete(id);

      if (!result) {
        return res.status(404).json({
          status: 'error',
          message: 'Product not found'
        });
      }

      res.json({
        status: 'success',
        message: 'Product deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }
};

module.exports = productController;
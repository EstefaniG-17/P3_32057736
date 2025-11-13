// controllers/productController.js
const { Product, Category, Tag } = require('../models');

const productController = {
  search: async (req, res) => {
    try {
      const products = await Product.findAll({
        include: [
          { model: Category },
          { model: Tag }
        ]
      });
      
      res.json({
        status: 'success',
        data: products,
        pagination: {
          total: products.length,
          page: 1,
          limit: 10,
          totalPages: 1
        }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  },

  getBySlug: async (req, res) => {
    try {
      const { id, slug } = req.params;
      const product = await Product.findByPk(id, {
        include: [
          { model: Category },
          { model: Tag }
        ]
      });

      if (!product) {
        return res.status(404).json({
          status: 'error',
          message: 'Product not found'
        });
      }

      // Self-healing logic
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

  create: async (req, res) => {
    try {
      res.status(401).json({
        status: 'error',
        message: 'Unauthorized - Not implemented'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }
};

// ✅ EXPORTAR como objeto
module.exports = productController;
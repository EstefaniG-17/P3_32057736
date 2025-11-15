const productRepository = require('../repositories/ProductRepository');
const responseHelper = require('../helpers/responseHelper');

const productController = {
  // RUTAS PÚBLICAS
  async getPublicProducts(req, res) {
    try {
      const result = await productRepository.findAllWithFilters(req.query);
      // result => { products, pagination }
      const products = result.products || [];
      const pagination = result.pagination || null;
      responseHelper.success(res, products, null, 200, { pagination });
    } catch (error) {
      responseHelper.error(res, error.message);
    }
  },

  async getProductBySlug(req, res) {
    try {
      const { id, slug } = req.params;
      const product = await productRepository.findById(id);
      
      if (!product) {
        return responseHelper.fail(res, 'Product not found');
      }

      // Self-healing: si el slug no coincide, redireccionar
      if (product.slug !== slug) {
        return res.redirect(301, `/p/${id}-${product.slug}`);
      }

      responseHelper.success(res, product);
    } catch (error) {
      responseHelper.error(res, error.message);
    }
  },

  // RUTAS PROTEGIDAS
  async getAll(req, res) {
    try {
      const products = await productRepository.findAll();
      responseHelper.success(res, products);
    } catch (error) {
      responseHelper.error(res, error.message);
    }
  },

  async getById(req, res) {
    try {
      const product = await productRepository.findById(req.params.id);
      if (!product) {
        return responseHelper.fail(res, 'Product not found');
      }
      responseHelper.success(res, product);
    } catch (error) {
      responseHelper.error(res, error.message);
    }
  },

  async create(req, res) {
    try {
      const product = await productRepository.create(req.body);
      responseHelper.success(res, product, 'Product created successfully', 201);
    } catch (error) {
      responseHelper.error(res, error.message);
    }
  },

  async update(req, res) {
    try {
      const product = await productRepository.update(req.params.id, req.body);
      if (!product) {
        return responseHelper.fail(res, 'Product not found');
      }
      responseHelper.success(res, product, 'Product updated successfully');
    } catch (error) {
      responseHelper.error(res, error.message);
    }
  },

  async delete(req, res) {
    try {
      const success = await productRepository.delete(req.params.id);
      if (!success) {
        return responseHelper.fail(res, 'Product not found');
      }
      responseHelper.success(res, null, 'Product deleted successfully');
    } catch (error) {
      responseHelper.error(res, error.message);
    }
  }
};

module.exports = productController;
const productRepository = require('../repositories/ProductRepository');
const responseHelper = require('../helpers/responseHelper');

const productController = {
  // RUTAS PÚBLICAS
  async getPublicProducts(req, res) {
    try {
      console.log('\n🔍 === getPublicProducts INICIADO ===');
      console.log('📝 URL completa:', req.originalUrl);
      console.log('🎯 Query params:', req.query);
      console.log('📍 Path:', req.path);
      
      const filters = req.query || {};
      console.log('🎛️ Filtros procesados:', filters);

      // Verificar si hay filtros reales (no solo paginación y con valor no vacío)
      const ignoredKeys = ['page', 'limit', 'per_page', 'pages', 'illimit'];
      const hasRealFilters = Object.entries(filters).some(([key, value]) => {
        if (ignoredKeys.includes(String(key).toLowerCase())) return false;
        if (value === undefined || value === null) return false;
        if (Array.isArray(value) && value.length === 0) return false;
        if (String(value).trim() === '') return false;
        return true;
      });

      console.log('❓ ¿Tiene filtros reales?:', hasRealFilters);
      
      const result = await productRepository.findAllWithFilters(filters);
      
      console.log('📊 Resultado del repositorio:');
      console.log(`   Productos encontrados: ${result.products?.length || 0}`);
      console.log('   Paginación:', result.pagination);
      
      const products = result.products || [];
      const pagination = result.pagination || null;
      
      // Para depuración, mostrar primeros 3 productos
      if (products.length > 0) {
        console.log('📦 Primeros 3 productos:');
        products.slice(0, 3).forEach((p, i) => {
          console.log(`   ${i+1}. ${p.name} - $${p.price}`);
        });
      }
      
      const isApi = req.originalUrl && req.originalUrl.startsWith('/api');
      if (isApi) {
        responseHelper.success(res, { items: products, pagination }, null, 200);
      } else {
        responseHelper.success(res, products, null, 200, { pagination });
      }
      
      console.log('✅ === getPublicProducts FINALIZADO ===\n');
      
    } catch (error) {
      console.error('❌ getPublicProducts ERROR:', error.message);
      console.error('Stack:', error.stack);
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
      console.error('getProductBySlug error:', error);
      responseHelper.error(res, error.message);
    }
  },

  // RUTAS PROTEGIDAS
  async getAll(req, res) {
    try {
      const products = await productRepository.findAll();
      responseHelper.success(res, products);
    } catch (error) {
      console.error('getAll products error:', error);
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
      console.error('getById product error:', error);
      responseHelper.error(res, error.message);
    }
  },

  async create(req, res) {
    try {
      const product = await productRepository.create(req.body);
      responseHelper.success(res, product, 'Product created successfully', 201);
    } catch (error) {
      console.error('create product error:', error);
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
      console.error('update product error:', error);
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
      console.error('delete product error:', error);
      responseHelper.error(res, error.message);
    }
  }
};

module.exports = productController;
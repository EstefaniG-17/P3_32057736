const { Category, Product } = require('../models');

const categoryController = {
  getAll: async (req, res) => {
    try {
      const categories = await Category.findAll();
      res.json({
        status: 'success',
        data: categories
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
      const category = await Category.findByPk(id);

      if (!category) {
        return res.status(404).json({
          status: 'error',
          message: 'Category not found'
        });
      }

      res.json({
        status: 'success',
        data: category
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
      const { name, description } = req.body;
      
      if (!name) {
        return res.status(400).json({
          status: 'error',
          message: 'Name is required'
        });
      }

      const category = await Category.create({ name, description });
      res.status(201).json({
        status: 'success',
        data: category
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
      const { name, description } = req.body;

      const category = await Category.findByPk(id);
      if (!category) {
        return res.status(404).json({
          status: 'error',
          message: 'Category not found'
        });
      }

      await category.update({ name, description });
      
      res.json({
        status: 'success',
        data: category
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
      const category = await Category.findByPk(id);

      if (!category) {
        return res.status(404).json({
          status: 'error',
          message: 'Category not found'
        });
      }

      // Eliminar productos relacionados para evitar errores de integridad
      try {
        await Product.destroy({ where: { categoryId: id } });
      } catch (e) {
        // Si falla, loguear y continuar intentando borrar la categoría
        console.warn('Could not delete related products:', e.message || e);
      }

      await category.destroy();

      res.json({
        status: 'success',
        message: 'Category deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }
};

module.exports = categoryController;
const { Category } = require('../models');

const categoryController = {
  getAll: async (req, res) => {
    try {
      const categories = await Category.findAll();
      res.json({
        status: 'success',
        data: categories || [] // ✅ Siempre retornar array
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

      const category = await Category.create({ 
        name, 
        description: description || '' 
      });
      
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
  }
};

module.exports = categoryController;
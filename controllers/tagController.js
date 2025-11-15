const { Tag } = require('../models');

const tagController = {
  getAll: async (req, res) => {
    try {
      const tags = await Tag.findAll();
      res.json({
        status: 'success',
        data: tags
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
      const tag = await Tag.findByPk(id);

      if (!tag) {
        return res.status(404).json({
          status: 'error',
          message: 'Tag not found'
        });
      }

      res.json({
        status: 'success',
        data: tag
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
      const { name } = req.body;
      
      if (!name) {
        return res.status(400).json({
          status: 'error',
          message: 'Name is required'
        });
      }

      const tag = await Tag.create({ name });
      res.status(201).json({
        status: 'success',
        data: tag
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
      const { name } = req.body;

      const tag = await Tag.findByPk(id);
      if (!tag) {
        return res.status(404).json({
          status: 'error',
          message: 'Tag not found'
        });
      }

      await tag.update({ name });
      
      res.json({
        status: 'success',
        data: tag
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
      const tag = await Tag.findByPk(id);

      if (!tag) {
        return res.status(404).json({
          status: 'error',
          message: 'Tag not found'
        });
      }

      await tag.destroy();
      
      res.json({
        status: 'success',
        message: 'Tag deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }
};

module.exports = tagController;
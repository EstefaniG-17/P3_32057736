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
  }
};

module.exports = tagController;
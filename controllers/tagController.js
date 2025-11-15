const { Tag } = require('../models');
const responseHelper = require('../helpers/responseHelper');

const tagController = {
  async getAll(req, res) {
    try {
      const tags = await Tag.findAll();
      responseHelper.success(res, tags);
    } catch (error) {
      responseHelper.error(res, error.message);
    }
  },

  async getById(req, res) {
    try {
      const tag = await Tag.findByPk(req.params.id);
      if (!tag) {
        return responseHelper.fail(res, 'Tag not found');
      }
      responseHelper.success(res, tag);
    } catch (error) {
      responseHelper.error(res, error.message);
    }
  },

  async create(req, res) {
    try {
      const { name } = req.body;
      const tag = await Tag.create({ name });
      responseHelper.success(res, tag, 'Tag created successfully', 201);
    } catch (error) {
      responseHelper.error(res, error.message);
    }
  },

  async update(req, res) {
    try {
      const tag = await Tag.findByPk(req.params.id);
      if (!tag) {
        return responseHelper.fail(res, 'Tag not found');
      }
      
      await tag.update(req.body);
      responseHelper.success(res, tag, 'Tag updated successfully');
    } catch (error) {
      responseHelper.error(res, error.message);
    }
  },

  async delete(req, res) {
    try {
      const tag = await Tag.findByPk(req.params.id);
      if (!tag) {
        return responseHelper.fail(res, 'Tag not found');
      }
      
      await tag.destroy();
      responseHelper.success(res, null, 'Tag deleted successfully');
    } catch (error) {
      responseHelper.error(res, error.message);
    }
  }
};

module.exports = tagController;
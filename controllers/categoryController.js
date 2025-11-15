const db = require('../models');
const { Category } = db;
const responseHelper = require('../helpers/responseHelper');

const categoryController = {
  async getAll(req, res) {
    try {
      const categories = await Category.findAll();
      responseHelper.success(res, categories);
    } catch (error) {
      responseHelper.error(res, error.message);
    }
  },

  async getById(req, res) {
    try {
      const category = await Category.findByPk(req.params.id);
      if (!category) {
        return responseHelper.fail(res, 'Category not found');
      }
      responseHelper.success(res, category);
    } catch (error) {
      responseHelper.error(res, error.message);
    }
  },

  async create(req, res) {
    try {
      const { name, description } = req.body;
      const category = await Category.create({ name, description });
      responseHelper.success(res, category, 'Category created successfully', 201);
    } catch (error) {
      responseHelper.error(res, error.message);
    }
  },

  async update(req, res) {
    try {
      const category = await Category.findByPk(req.params.id);
      if (!category) {
        return responseHelper.fail(res, 'Category not found');
      }
      
      await category.update(req.body);
      responseHelper.success(res, category, 'Category updated successfully');
    } catch (error) {
      responseHelper.error(res, error.message);
    }
  },

  async delete(req, res) {
    try {
      const category = await Category.findByPk(req.params.id);
      if (!category) {
        return responseHelper.fail(res, 'Category not found');
      }
      // Eliminar productos relacionados primero para evitar errores por FK
      if (db.Product) {
        await db.Product.destroy({ where: { categoryId: category.id } });
      }
      await category.destroy();
      responseHelper.success(res, null, 'Category deleted successfully');
    } catch (error) {
      responseHelper.error(res, error.message);
    }
  }
};

module.exports = categoryController;
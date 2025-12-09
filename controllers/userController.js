const { User } = require('../models');
const bcrypt = require('bcryptjs');

const userController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: { exclude: ['password'] }
      });
      res.json({
        status: 'success',
        data: users
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  },

  getUserById: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id, {
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
      }

      res.json({
        status: 'success',
        data: user
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  },

  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, role } = req.body;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
      }

      await user.update({ name, email, role });
      
      res.json({
        status: 'success',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
      }

      await user.destroy();
      
      res.json({
        status: 'success',
        message: 'User deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }
};

// Crear usuario (protegido por auth en routes)
userController.createUser = async (req, res) => {
  try {
    const { nombreCompleto, name, email, password, cedula, seccion, role } = req.body;
    const fullName = nombreCompleto || name;

    // Validaciones básicas
    if (!fullName || !email || !password) {
      return res.status(400).json({ status: 'error', message: 'Missing required fields' });
    }

    // Crear usuario (el hook del modelo hará el hash)
    // No guardar `seccion` por requerimiento; almacenar `cedula` y devolverla.
    const user = await User.create({
      nombreCompleto: fullName,
      email,
      password,
      cedula: cedula || null,
      role: role || 'user'
    });

    res.status(201).json({ status: 'success', data: { id: user.id, email: user.email, cedula: user.cedula || null } });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = userController;
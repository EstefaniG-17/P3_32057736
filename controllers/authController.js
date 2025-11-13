const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authController = {
  register: async (req, res) => {
    try {
      const { name, nombreCompleto, email, password, cedula, seccion, role } = req.body;
      const fullName = nombreCompleto || name;
      
      // Verificar si el usuario ya existe
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          status: 'error',
          message: 'User already exists'
        });
      }

      // Crear usuario (el hook del modelo hará el hash de la contraseña)
      const user = await User.create({
        nombreCompleto: fullName,
        email,
        password,
        cedula: cedula || null,
        seccion: seccion || null,
        role: role || 'user'
      });

      // Generar token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '24h' }
      );

      res.status(201).json({
        status: 'success',
        data: {
          user: {
            id: user.id,
            nombreCompleto: user.nombreCompleto,
            email: user.email,
            role: user.role
          },
          token
        }
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Buscar usuario
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid credentials'
        });
      }

      // Verificar password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid credentials'
        });
      }

      // Generar token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '24h' }
      );

      res.json({
        status: 'success',
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          },
          token
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }
};

module.exports = authController;
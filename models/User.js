const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    // Virtual 'name' field to accept test payloads using 'name' and map to 'nombreCompleto'
    name: {
      type: DataTypes.VIRTUAL,
      set(value) {
        // Store on the real field so validations and DB use it
        this.setDataValue('nombreCompleto', value);
        this.setDataValue('name', value);
      },
      get() {
        return this.getDataValue('nombreCompleto');
      }
    },
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    nombreCompleto: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true, notEmpty: true }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true, len: [6, 100] }
    },
    cedula: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: { notEmpty: true }
    },
    seccion: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { notEmpty: true }
    }
  }, {
    tableName: 'users',
    timestamps: true,
    hooks: {
      beforeValidate: (user) => {
        // Compatibilidad: si se pasa 'name' en lugar de 'nombreCompleto'
        // Intentar leer 'name' desde dataValues en caso de que no esté como propiedad directa
        const maybeName = (user && user.dataValues && user.dataValues.name) || user.name;
        if (maybeName && !user.nombreCompleto) {
          user.nombreCompleto = maybeName;
        }
        // Si no se pasó cedula/seccion, dejarlo como null (tests a veces no envían esos campos)
      },
      beforeCreate: async (user) => {
        user.password = await bcrypt.hash(user.password, 12);
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 12);
        }
      }
    }
  });

  User.prototype.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };

  User.prototype.toJSON = function() {
    const values = { ...this.get() };
    delete values.password;
    return values;
  };

  return User;
};
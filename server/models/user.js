'use strict';
const { encrypt } = require('../helpers/bcrypt')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Email cannot be empty"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Password cannot be empty"
        }
      }
    },
    organization: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate(user, option) {
        user.password = encrypt(user.password);
        user.organization = 'Hacktiv8'
      }
    }
  });
  User.associate = function (models) {
    User.hasMany(models.Task)
    // associations can be defined here
  };
  return User;
};
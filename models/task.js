'use strict';
module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Title cannot be empty"
        }
      }
    },
    category: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Category cannot be empty"
        }
      }
    },
    UserId: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: "UserId cannot be empty"
        }
      }
    }
  }, {});
  Task.associate = function (models) {
    Task.belongsTo(models.User)
    // associations can be defined here
  };
  return Task;
};
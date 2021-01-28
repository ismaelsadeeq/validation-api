'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    
  };
  user.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    mobile: DataTypes.STRING,
    twitter: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};
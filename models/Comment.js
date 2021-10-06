const { Model, DataTypes } = require('sequelize')
const sequelize = require('../db')

class Comment extends Model { }

// initialize Comment table/columns
Comment.init({
 comment: {
  type: DataTypes.STRING,
  allowNull: false
 },
 postId: {
  type: DataTypes.INTEGER,
  allowNull: false
 },
 username: {
  type: DataTypes.STRING,
  allowNull: false
 }
}, { sequelize, modelName: 'comment'})

// export Comment
module.exports = Comment

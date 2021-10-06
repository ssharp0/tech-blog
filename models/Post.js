const { Model, DataTypes } = require('sequelize')
const sequelize = require('../db')

class Post extends Model { }

// initialize Post table/columns
Post.init({
  title: DataTypes.STRING,
  body: DataTypes.STRING,
}, { sequelize, modelName: 'post' })

// export Post
module.exports = Post

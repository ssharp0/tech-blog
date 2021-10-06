const pls = require('passport-local-sequelize')
const { DataTypes } = require('sequelize')
const sequelize = require('../db')

// User
const User = pls.defineUser(sequelize, { username: DataTypes.STRING })

// export user
module.exports = User

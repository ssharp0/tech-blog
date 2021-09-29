// require sequelize
const { Sequelize } = require('sequelize')

// sequelize JAWS database (heroku deployment) or local database
module.exports = new Sequelize(process.env.JAWSDB_URL || process.env.LOCAL_URL)

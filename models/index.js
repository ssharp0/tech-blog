// require from models
const User = require('./User.js')
const Post = require('./Post.js')
const Comment = require('./Comment.js')

// user has many posts (uid userid)
User.hasMany(Post, { foreignKey: 'uid' })
// post belongs to user (uid userid)
Post.belongsTo(User, { as: 'u', foreignKey: 'uid' })

// user has many comment (uid userid)
User.hasMany(Comment, { foreignKey: 'uid' })
// post has many comment
Post.hasMany(Comment, { foreignKey: 'postId', onDelete: 'CASCADE' })
// comment belongs to user
Comment.belongsTo(User, { as: 'u', foreignKey: 'uid' })

// export User, Post, Comment
module.exports = { User, Post, Comment }
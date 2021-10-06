const router = require('express').Router()
const { Post, Comment } = require('../models')
const passport = require('passport')

// router to post comments
router.post('/comments', passport.authenticate('jwt'), (req, res) => {
 let id = (parseInt(req.body.id))
 Comment.create({
  postId: id,
  username: req.user.username,
  comment: req.body.comment,
  uid: req.user.id
 })
  .then(comment => {
   Comment.findAll({ include: "u" })
    .then(comment => res.json(comment))
  })
  .catch(err => console.log(err))
})

// router get comments (based on post id)
router.get('/comments/:postId', (req, res) => {
 // find all comment where the post id matches the request id (post id)
 Comment.findAll({
  where: {
   postId: req.params.postId
  }
 })
  .then(comments => {
   res.json(comments)
  })
  .catch(err => console.log(err))
})

// export router
module.exports = router
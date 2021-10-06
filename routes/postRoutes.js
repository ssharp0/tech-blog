const router = require('express').Router()
const { Post, User } = require('../models')
const passport = require('passport')

// router to get all posts and include the u (user) without auth
router.get('/posts', (req, res) => {
  Post.findAll({ include: 'u' })
  .then(posts => res.json(posts))
  .catch(err => console.log(err))
})

// router to post (create new posts) with auth
router.post('/posts', passport.authenticate('jwt'), (req, res) => {
  Post.create({
    title: req.body.title,
    body: req.body.body,
    uid: req.user.id
  })
    .then(post => Post.findOne({ where: { id: post.id }, include: 'u' }))
    .then(post => res.json(post))
    .catch(err => console.log(err))
})

// router to delete a post by the post id (handled on dashboard) with auth
router.delete('/posts/:id', passport.authenticate('jwt'), (req, res) => Post.destroy({ where: { id: req.params.id } })
  .then(() => res.sendStatus(200))
  .catch(err => console.log(err)))

// router to put/update post by id with auth
router.put('/posts/:id', passport.authenticate('jwt'), (req, res) => {
  Post.update(req.body, {
    where: { id: req.params.id}})
    .then(affectedRows => {
      if (affectedRows > 0) {
        res.status(200).end()
      }
      else {
        res.status(404).end()
      }
    })
    .catch(err => { res.status(500).json(err) })
})



// export router for use
module.exports = router

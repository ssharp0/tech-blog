const router = require('express').Router()
const { User } = require('../models')
const passport = require('passport')
const jwt = require('jsonwebtoken')

// router for users/register to register new users from username and password
router.post('/users/register', (req, res) => {
  User.register(new User({ username: req.body.username }), req.body.password, err => {
    if (err) { console.log(err) }
    res.sendStatus(200)
  })
})

// router for users to login
router.post('/users/login', (req, res) => {
  User.authenticate()(req.body.username, req.body.password, (err, user) => {
    if (err) { console.log(err) }
    res.json(user ? jwt.sign({ id: user.id }, process.env.SECRET) : null)
  })
})

// router to get all users posts
router.get('/users/posts', passport.authenticate('jwt'), (req, res) => res.json(req.user))

// add error check duplicate username exists or blank values (also check on front)


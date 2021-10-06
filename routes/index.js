const router = require('express').Router()

// prefix api to the routes
router.use('/api', require('./userRoutes.js'))
router.use('/api', require('./postRoutes.js'))
router.use('/api', require('./commentRoutes.js'))

// export router
module.exports = router
const router = require('express').Router()
const { getBlogs, blogSearch } = require('../controller/controller')

// get blog stats
router.get('/blog-stats', getBlogs)
// blog search
router.get('/blog-search', blogSearch)


module.exports = router
const { default: axios } = require("axios")
const _ = require('lodash')

// url and header
const url = process.env.API_URL
const headers = {
    'x-hasura-admin-secret': process.env.API_SECRET
}

//---------------------------------------- get blog stats ----------------------------------------
const getBlogs = async (req, res) => {

    try {
        // get blogs stats from cachedBlogStats function
        const blogStats = await cachedGetBlogs()
        // send response
        res.status(200).json(blogStats)

    } catch (error) {
        console.log(error);
        res.status(503).json({ message: "Something went wrong while getting data from API, Please try again." })
    }
}

//------------------------------------------- Blog Search -------------------------------------------
const blogSearch = async (req, res) => {

    try {
        const query = req.query.query || ''
        // get blogs from cachedBlogSearch function
        const filteredBlogs = await cachedBlogSearch(query)
        res.status(200).json(filteredBlogs)

    } catch (error) {
        console.log(error);
        res.status(503).json({ message: 'Something went wrong while getting data from API, Please try again.' })
    }
}

// cache for blog stats
const cachedGetBlogs = _.memoize(async () => {

    try {
        // Fetch blogs from the API
        const { data } = await axios.get(url, { headers })
        const blogs = data.blogs;

        // calculate total number of blogs
        const totalBlogs = _.size(blogs)
        // longest title 
        const { title: longestTitleBlog } = _.maxBy(blogs, (blog) => blog.title.length)
        // number of blogs with privacy title
        const blogsWithPrivacyTitle = _.size(_.filter(blogs, (blog) => _.includes(_.toLower(blog.title), 'privacy')))
        // unique blog title while ignoring the case (treating titles with different casing as the same)
        const uniqueBlogTitles = _.chain(blogs)
            .uniqBy((blog) => _.toLower(blog.title))
            .map((blog) => blog.title)
            .value()
        // return the result
        return {
            totalBlogs,
            longestTitleBlog,
            blogsWithPrivacyTitle,
            uniqueBlogTitles,
        };
    } catch (error) {
        console.error(error)
        throw error
    }
}, () => 'blogStatistics', 120000)

// cache search result based on query
const cachedBlogSearch = _.memoize(async (query) => {

    try {
        const { data } = await axios.get(url, { headers })
        const blogs = data.blogs
        // filter blogs that matches the query
        const filteredBlogs = _.filter(blogs, (blog) => _.includes(_.toLower(blog.title), _.toLower(query)))
        return filteredBlogs
    } catch (error) {
        console.error(error)
        throw error
    }
}, (query) => query, 120000)

module.exports = {
    getBlogs,
    blogSearch
}
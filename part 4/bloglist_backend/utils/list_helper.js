const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const likes = blogs.map(blog => blog.likes)

  const likesReducer = likes.reduce((sum, current) => {
    return sum + current
  }, 0)

  return likesReducer
}

const favouriteBlog = (blogs) => {
  const likes = blogs.map(blog => blog.likes)
  
  const maxLikes = likes.length === 0? 0 : Math.max(...likes)
  
  return maxLikes
}

const mostBlogs = (blogs) => {
  const authorsBlogs = _.countBy(blogs, 'author')
  const topAuthor = _.maxBy(Object.keys((authorsBlogs), author => authorsBlogs[author]))

  return blogs.length === 0? {} : { author: topAuthor, blogs: authorsBlogs[topAuthor] }
}

const mostLikes = (blogs) => {
  const topLikes = _.maxBy(blogs, 'likes')

  return blogs.length === 0? {} : { author: topLikes.author, likes: topLikes.likes }
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}
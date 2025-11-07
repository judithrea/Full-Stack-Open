const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcryptjs')

const initialBlogs = [
  {
    title: 'blog 1',
    author: 'author 1',
    url: 'https://www.blog1.com',
    likes: 5,
  },
  {
    title: 'blog 2',
    author: 'author 2',
    url: 'https://www.blog2.com',
    likes: 8,
  }
]

const insertUser = async() => {
  const passwordHash = await bcrypt.hash('testpassword', 10)
  const user = new User({
    username: 'testuser',
    name: 'Test User',
    passwordHash
  })

  await user.save()
}

const nonExistingId = async() => {
  const blog = new Blog({ 
    title: 'soon to be removed',
    author: 'author 5',
    url: 'https://www.blog5.com',
    likes: 2,
  })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async() => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs, 
  insertUser,
  nonExistingId,
  blogsInDb,
  usersInDb
}
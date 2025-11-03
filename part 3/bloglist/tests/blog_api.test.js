const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const { log } = require('node:console')
const { update } = require('lodash')

const api = supertest(app)

describe('when there are some blogs initially saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('blogs are returned as json', async () => {
    await api 
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })
  describe('viewing a specific blog', () => {
    test('the unique identifier of each blog is named id', async() => {
      const savedBlogs = await helper.blogsInDb() 
      const blogsId = savedBlogs.map(blog => Object.keys(blog).find(key => key === 'id'))

      assert.strictEqual(blogsId[0], 'id')
    })

    test('a specific blog can be viewed', async () => {
      const savedBlogs = await helper.blogsInDb()
      const blogToView = savedBlogs[0]

      const fetchedBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(fetchedBlog.body, blogToView)
    })

    test('a specific title is within returned blogs', async() => {
      const response = await api.get('/api/blogs')

      const titles = response.body.map(blog => blog.title)
      assert(titles.includes('blog 1'))
    })
  })

  describe('adding a new blog', () => {
    test('a valid blog can be added', async () => {
      const newBlog = {
        title: 'blog 3',
        author: 'author 3',
        url: 'https://www.blog3.com',
        likes: 9,
      }

      await api 
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const savedBlogs = await helper.blogsInDb()
      const titles = savedBlogs.map(blog => blog.title)

      assert.strictEqual(savedBlogs.length, helper.initialBlogs.length + 1)
      assert(titles.includes('blog 3'))
    })

    test('if the likes property is missing it defaults to 0', async () => {
      const newBlog = {
        title: 'blog 3',
        author: 'author 3',
        url: 'https://www.blog3.com',
      }

      await api 
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)

      const savedBlogs = await helper.blogsInDb()
      const likesAddedBlog = savedBlogs.map(blog => blog.likes)

      assert.strictEqual(likesAddedBlog[2], 0)
    })

    test('a blog without title or url is not added', async() => {
      const newBlog = {
        author: 'author 4',
        url: 'https://www.blog4.com',
        likes: 4
      }

      const newBlog2 = {
        title: 'title 5',
        author: 'author 5',
        likes: 2
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
      
      await api
        .post('/api/blogs')
        .send(newBlog2)
        .expect(400)

      const savedBlogs = await helper.blogsInDb()

      assert.strictEqual(savedBlogs.length, helper.initialBlogs.length)
    })
  })

  describe('deleting a blog', () => {
    test('a blog can be deleted', async () => {
      const savedBlogs = await helper.blogsInDb()
      const blogToDelete = savedBlogs[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const remainingBlogs = await helper.blogsInDb()
      const titles = remainingBlogs.map(blog => blog.title)

      assert.strictEqual(remainingBlogs.length, helper.initialBlogs.length - 1)
      assert(!titles.includes(blogToDelete.title))
    })
  })

  describe('updating a blog', () => {
    test('likes for a blog post can be updated', async () => {
      const updatedBlog = {
        title: 'blog 1',
        author: 'author 1',
        url: 'https://www.blog1.com',
        likes: 6,
      }

      const savedBlogs = await helper.blogsInDb()
      const blogToUpdate = savedBlogs[0]

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const updatedBlogs = await helper.blogsInDb()
      const updatedLikes = updatedBlogs.map(blog => blog.likes)

      assert.strictEqual(updatedLikes[0], blogToUpdate.likes + 1)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})





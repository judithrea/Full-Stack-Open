const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
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

  describe('when there is initially one user in db', () => {
    beforeEach(async () => {
      await User.deleteMany({})
      await helper.insertUser()
    })

    const getLoginToken = async () => {
      const response = await api
        .post('/api/login')
        .send({
          username: 'testuser',
          password: 'testpassword'
        })

      return response.body.token
    }

    describe('adding a new blog', () => {
      test('a valid blog can be added with a valid token', async () => {
        const token = await getLoginToken()
        const userId = jwt.verify(token, process.env.SECRET).id
        const newBlog = {
          title: 'blog 3',
          author: 'author 3',
          url: 'https://www.blog3.com',
          likes: 9,
          user: userId
        }

        await api 
          .post('/api/blogs')
          .set('Authorization', `Bearer ${token}`)
          .send(newBlog)
          .expect(201)
          .expect('Content-Type', /application\/json/)

        const savedBlogs = await helper.blogsInDb()
        const titles = savedBlogs.map(blog => blog.title)

        assert.strictEqual(savedBlogs.length, helper.initialBlogs.length + 1)
        assert(titles.includes('blog 3'))
      })

      test('a blog without a valid token is not added', async() => {
        const newBlog = {
          title: 'title 5',
          author: 'author 4',
          url: 'https://www.blog4.com',
          likes: 4
        }

        await api
          .post('/api/blogs')
          .set('Authorization', 'Bearer invalidToken')
          .send(newBlog)
          .expect(401)

        const savedBlogs = await helper.blogsInDb()

        assert.strictEqual(savedBlogs.length, helper.initialBlogs.length)
      })

      test('if the likes property is missing it defaults to 0', async () => {
        const token = await getLoginToken()
        const userId = jwt.verify(token, process.env.SECRET).id
        const newBlog = {
          title: 'blog 3',
          author: 'author 3',
          url: 'https://www.blog3.com',
          user: userId
        }

        await api 
          .post('/api/blogs')
          .set('Authorization', `Bearer ${token}`)
          .send(newBlog)
          .expect(201)

        const savedBlogs = await helper.blogsInDb()
        const likesAddedBlog = savedBlogs.map(blog => blog.likes)

        assert.strictEqual(likesAddedBlog[2], 0)
      })

      test('a blog without title or url is not added', async() => {
        const token = await getLoginToken()
        const userId = jwt.verify(token, process.env.SECRET).id
        const newBlog = {
          author: 'author 4',
          url: 'https://www.blog4.com',
          likes: 4,
          user: userId
        }

        const newBlog2 = {
          title: 'title 5',
          author: 'author 5',
          likes: 2,
          user: userId
        }

        await api
          .post('/api/blogs')
          .set('Authorization', `Bearer ${token}`)
          .send(newBlog)
          .expect(400)
        
        await api
          .post('/api/blogs')
          .set('Authorization', `Bearer ${token}`)
          .send(newBlog2)
          .expect(400)

        const savedBlogs = await helper.blogsInDb()

        assert.strictEqual(savedBlogs.length, helper.initialBlogs.length)
      })
    })

    describe('deleting a blog', () => {
      test('a blog can be deleted', async () => {
        const token = await getLoginToken()
        const userId = jwt.verify(token, process.env.SECRET).id
        const blogToDelete = await api
          .post('/api/blogs')
          .set('Authorization', `Bearer ${token}`)
          .send({
            title: "Title 3",
            author: 'author 3',
            url: 'https://www.blog3.com',
            likes: 7,
            user: userId
          })
        const userBeforeDelete = await User.findById(userId)
        const savedBlogs = await helper.blogsInDb()

        await api
          .delete(`/api/blogs/${blogToDelete.body.id}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(204)

        const remainingBlogs = await helper.blogsInDb()
        const userAfterDelete = await User.findById(userId)
        const titles = remainingBlogs.map(blog => blog.title)
        
        assert.strictEqual(remainingBlogs.length, savedBlogs.length - 1)
        assert.strictEqual(userAfterDelete.blogs.length, userBeforeDelete.blogs.length - 1)
        assert(!titles.includes(blogToDelete.title))
      })
    })
  })
})

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await helper.insertUser()
  })

  describe('adding a new user', async () => {
    test('user creation succeeds with a new username', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'user1',
        name: 'User 1',
        password: 'testpassword1',
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

      const usernames = usersAtEnd.map(u => u.username)
      assert(usernames.includes(newUser.username))
    })

    test('user creation fails with proper statuscode and message if username already exists', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'testuser',
        name: 'User 1',
        password: 'user1pass',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtStart.length, usersAtEnd.length)
      assert(result.body.error.includes('expected `username` to be unique'))
    })

    test('user creation fails if invalid username is given', async () => {
      const usersAtStart = await helper.usersInDb()

      const shortUsername = {
        username: 'sh',
        name: 'Short Username',
        password: 'short1',
      }

      const failedUsername = await api
        .post('/api/users')
        .send(shortUsername)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      
      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtStart.length, usersAtEnd.length)
      assert(failedUsername.body.error.includes('User validation failed: username'))
    })

    test('user creation fails if invalid password is given', async () => {
      const usersAtStart = await helper.usersInDb()

      const shortPassword = {
        username: 'shortpass',
        name: 'Short Password',
        password: 'sh',
      }

      const failedPassword = await api
        .post('/api/users')
        .send(shortPassword)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      
      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtStart.length, usersAtEnd.length)
      assert(failedPassword.body.error.includes('password must be at least 3 characters long'))
    })  

    test('user creation fails if username is not given', async () => {
      const usersAtStart = await helper.usersInDb()

      const noUsername = {
        name: 'Short Username',
        password: 'short1',
      }

      const failedUsername = await api
        .post('/api/users')
        .send(noUsername)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      
      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtStart.length, usersAtEnd.length)
      assert(failedUsername.body.error.includes('User validation failed: username: Path `username` is required'))
    })

    test('user creation fails if password is not given', async () => {
      const usersAtStart = await helper.usersInDb()

      const noPassword = {
        username: 'shortpass',
        name: 'Short Password'
      }

      const failedPassword = await api
        .post('/api/users')
        .send(noPassword)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      
      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtStart.length, usersAtEnd.length)
      assert(failedPassword.body.error.includes('password missing'))
    })
  })  
})

after(async () => {
  await mongoose.connection.close()
})





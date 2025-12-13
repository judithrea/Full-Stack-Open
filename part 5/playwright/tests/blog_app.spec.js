const { test, describe, expect, beforeEach } = require('@playwright/test')
const {loginWith, createBlog} = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({page, request}) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Test User',
        username: 'testuser',
        password: 'testuserpass'
      }
    })

    await page.goto('/')
  })

  test('login form is shown by default', async ({page}) => {
    await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible()
  })

  describe('Login', () =>  {
    test('login is successful with correct credentials', async ({page}) => {
      await loginWith(page, 'testuser', 'testuserpass')
      await expect(page.getByText('Test User logged in')).toBeVisible()
    })

    test('login fails with wrong credentials', async ({page}) => {
      await loginWith(page, 'testuser', 'userpass')
      await expect(page.getByText('Wrong credentials')).toBeVisible()
      await expect(page.getByText('Test User logged in')).not.toBeVisible()
    })
  })

  describe('when logged in', () => {
    beforeEach(async ({page}) => {
      await loginWith(page, 'testuser', 'testuserpass')
      await createBlog(page, 'Test blog', 'Test author', 'www.testurl.com')
    })

    test('a new blog can be created', async ({page}) => {
      await expect(page.getByText('Test blog')).toBeVisible()
    })

    test('a blog can be liked', async ({page}) => {
      await page.getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'like' }).click()
      const likesEnd = page.getByTestId('likes')

      await expect(likesEnd).toContainText('1')
    })

    test('user who created blog can delete it', async ({page}) => {
      await page.getByRole('button', { name: 'view' }).click()
      page.on('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'remove' }).click()
      
      await expect(page.getByText('Test blog')).not.toBeVisible()
    })

    test('only user who created blog can see remove button', async ({page, request}) => {
      await request.post('/api/users', {
        data: {
          name: 'Test User 1',
          username: 'testuser1',
          password: 'testuser1pass'
        }
      })

      await page.getByRole('button', { name: 'log out' }).click()
      await loginWith(page, 'testuser1', 'testuser1pass')
      await page.getByRole('button', { name: 'view' }).click()

      await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })

    test('blogs are ordered according to number of likes', async ({page}) => {
      await page.getByRole('button', { name: 'view' }).click()

      await createBlog(page, 'Extra test blog', 'Extra test author', 'www.extratesturl.com')

      await page.getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'like' }).last().click()
      
      const blogs = page.getByTestId('blog')
      await expect(blogs).toContainText(['1', '0'])
    })
  })
})

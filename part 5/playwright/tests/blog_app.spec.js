const { test, describe, expect, beforeEach } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({page, request}) => {
    await request.post('http://localhost:3001/api/testing/reset')
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Test User',
        username: 'testuser',
        password: 'testuserpass'
      }
    })

    await page.goto('http://localhost:5173')
  })

   test('login form is shown by default', async ({page}) => {
    await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible()
  })

  describe('Login', () =>  {
    test('login is successful with correct credentials', async ({page}) => {
      await page.getByLabel('username').fill('testuser')
      await page.getByLabel('password').fill('testuserpass')
      await page.getByRole('button', { name: 'Log in' }).click()
      await expect(page.getByText('Test User logged in')).toBeVisible()
    })

    test('login fails with wrong credentials', async ({page}) => {
      await page.getByLabel('username').fill('testuser')
      await page.getByLabel('password').fill('user1pass')
      await page.getByRole('button', { name: 'Log in' }).click()
      await expect(page.getByText('Wrong credentials')).toBeVisible()
      await expect(page.getByText('Test User logged in')).not.toBeVisible()
    })
  })

  describe('when logged in', () => {
    beforeEach(async ({page}) => {
      await page.getByLabel('username').fill('testuser')
      await page.getByLabel('password').fill('testuserpass')
      await page.getByRole('button', { name: 'Log in' }).click()
    })

    test('a new blog can be created', async ({page}) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByLabel('title').fill('Test blog')
      await page.getByLabel('author').fill('Test author')
      await page.getByLabel('url').fill('www.testurl.com')
      await page.getByRole('button', { name: 'Add' }).click()
      await expect(page.getByText('Test blog')).toBeVisible()
    })
  })
})

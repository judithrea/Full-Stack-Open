import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('<Blog /> renders title and author by default but not likes and url', () => {
  const blog = {
    title: 'Test Title',
    author: 'Test Author',
    likes: 0,
    url: 'www.testurl.com'
  }

  render(<Blog blog={blog}/>)

  const title = screen.getByText('Test Title', {exact: false})
  const author = screen.getByText('Test Author', {exact: false})
  const likes = screen.queryByText(0)
  const url = screen.queryByText('www.testurl.com')

  expect(title).toBeDefined()
  expect(author).toBeDefined()
  expect(url).toBeNull()
  expect(likes).toBeNull()
})


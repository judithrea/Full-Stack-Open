import { useState, useRef } from 'react'
import blogService from '../services/blogs'
import Togglable from './Togglable'

const BlogForm = ({ blogs, setBlogs, setNotification }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const blogFormRef = useRef()

  const handleCreateBlog = async (event) => {
    event.preventDefault()

    try {
      blogFormRef.current.toggleVisibility()
      const newBlog = await blogService.create({ title, author, url })
      setBlogs(blogs.concat(newBlog))
      setTitle('')
      setAuthor('')
      setUrl('')
      setNotification({
        message: 'Successfully added new blog.',
        type: 'success'
      })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch {
      setNotification({
        message: 'Creation not successful.',
        type: 'error'
      })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  return (
    <div>
      <Togglable showButton='new blog' hideButton='cancel' ref={blogFormRef}>
        <h2>Add a new blog</h2>
        <form onSubmit={handleCreateBlog}>
          <div>
            <label>
            title:
              <input
                type="text"
                value={title}
                onChange={({ target }) => setTitle(target.value)} />
            </label>
          </div>
          <div>
            <label>
            author:
              <input
                type="text"
                value={author}
                onChange={({ target }) => setAuthor(target.value)} />
            </label>
          </div>
          <div>
            <label>
            url:
              <input
                type="text"
                value={url}
                onChange={({ target }) => setUrl(target.value)} />
            </label>
          </div>
          <button type='submit'>Add</button>
        </form>
      </Togglable>
    </div>
  )
}

export default BlogForm
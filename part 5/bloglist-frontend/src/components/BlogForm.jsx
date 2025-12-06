import { useState, useRef } from 'react'
import blogService from '../services/blogs'
import Togglable from './Togglable'

const BlogForm = ({ blogs, setBlogs, setNotification, onSubmit }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const blogFormRef = useRef()

  const handleSubmit = async (event) => {
    event.preventDefault()

    const blogObject = {
      title,
      author,
      url
    }

    try {
      blogFormRef.current.toggleVisibility()
      await onSubmit (blogObject)

      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (error) {
      console.error('Blog creation failed', error)
    }
  }

  return (
    <div>
      <Togglable showButton='new blog' hideButton='cancel' ref={blogFormRef}>
        <h2>Add a new blog</h2>
        <form onSubmit={handleSubmit}>
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
          <button type='submit' id='submitBlogForm'>Add</button>
        </form>
      </Togglable>
    </div>
  )
}

export default BlogForm
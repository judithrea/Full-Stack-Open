import { useState } from "react"
import blogService from '../services/blogs'

const BlogForm = ({ blogs, setBlogs, setNotification }) => {
  const [blogFormVisible, setBlogFormVisible] = useState(false)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const toggleCreateBtn = {display: blogFormVisible ? 'none' : ''}
  const toggleBlogForm = {display: blogFormVisible ? '' : 'none'}

  const handleCreateBlog = async (event) => {
    event.preventDefault()
    
    try { 
      const newBlog = await blogService.create({ title, author, url })
      setBlogs(blogs.concat(newBlog))
      setTitle('')
      setAuthor('')
      setUrl('')
      setNotification({
        message: 'Successfully added new blog',
        type: 'success'
      })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch {
      setNotification('Creation not successful')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }
  
  return (
    <div>
      <div style={toggleCreateBtn}>
        <button onClick={() => setBlogFormVisible(true)}>Create new blog</button>
      </div>
      <div style={toggleBlogForm}>
        <form onSubmit={handleCreateBlog}>
          <div>
            <label>
            title:
            <input 
            type="text"
            value={title}
            onChange={({target}) => setTitle(target.value)} />
            </label>
          </div>
          <div>
            <label>
            author:
            <input 
            type="text"
            value={author}
            onChange={({target}) => setAuthor(target.value)} />
            </label>
          </div>
          <div>
            <label>
            url:
            <input 
            type="text"
            value={url}
            onChange={({target}) => setUrl(target.value)} />
            </label>
          </div>
          <button type='submit'>Create</button>
        </form>
        <button type='submit'onClick={() => setBlogFormVisible(false)}>Cancel</button>
      </div>  
    </div>
  )
}

export default BlogForm
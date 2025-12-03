// import { useState } from 'react'
import Togglable from './Togglable'

const Blog = ({ user, blog, handleLikeUpdate, handleDeleteBlog }) => {
  // const [detailsVisible, setDetailsVisible] = useState(false)

  // const toggleViewBtn = { display: detailsVisible ? 'none' : '' }
  // const toggleDetails = { display: detailsVisible ? '' : 'none' }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const deleteBlog = () => {
    const ok = window.confirm(`Remove post '${blog.title}' by ${blog.author}?`)
    if (ok) {handleDeleteBlog(blog)}
  }

  return (
    <div className='blog' style={blogStyle}>
      {blog.title} {blog.author}
      <Togglable showButton='view' hideButton='hide'>
        <div>
          {blog.url} {<br/>}
          {blog.likes}  <button onClick={() => {handleLikeUpdate(blog)}}>like</button> {<br/>}
          {blog.user ? blog.user.name : ''}
          {blog.user ? blog.user.username === user.username ? <button onClick={deleteBlog}>remove</button> : '' : ''}
        </div>
      </Togglable>
    </div>
  )
}

export default Blog
import { useState } from 'react'

const Blog = ({ user, blog, handleLikeUpdate, handleDeleteBlog }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)

  const toggleViewBtn = { display: detailsVisible ? 'none' : '' }
  const toggleDetails = { display: detailsVisible ? '' : 'none' }

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
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button style={toggleViewBtn} onClick={() => setDetailsVisible(true)}>View</button>
        <button style={toggleDetails} onClick={() => setDetailsVisible(false)}>hide</button>
      </div>
      <div style={toggleDetails} >
        {blog.url} {<br/>}
        {blog.likes}  <button onClick={() => {handleLikeUpdate(blog)}}>like</button> {<br/>}
        {blog.user ? blog.user.name : ''}
        {blog.user ? blog.user.username === user.username ? <button onClick={deleteBlog}>remove</button> : '' : ''}
      </div>
    </div>
  )
}

export default Blog
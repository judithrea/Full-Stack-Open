import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort((a, b) => b.likes - a.likes) )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      setNotification({
        message: 'Wrong credentials',
        type: 'error'
      })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
  }

  const handleCreateBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(newBlog))
      setNotification({
        message: 'Successfully added new blog.',
        type: 'success'
      })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (error) {
      console.error('Blog creation failed', error)
      setNotification({
        message: 'Creation not successful.',
        type: 'error'
      })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleLikeUpdate = async (blog) => {
    try {
      const updatedBlog = await blogService.update(blog.id, { likes: blog.likes + 1 })
      setBlogs(blogs.map(blog => blog.id === updatedBlog.id ? updatedBlog : blog).sort((a, b) => b.likes - a.likes))
    } catch (error) {
      console.error(error)
      setNotification({
        message: 'Something went wrong. Please try again.',
        type: 'error'
      })
      setTimeout(() => {
        setNotification(null)
      })
    }
  }

  const handleDeleteBlog = async (blog) => {
    try {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
    } catch (error) {
      console.error('Blog deletion failed', error)
      setNotification({
        message: 'Something went wrong. Please try again.',
        type: 'error'
      })
      setTimeout(() => {
        setNotification(null)
      })
    }
  }

  return (
    <div>
      <h2>Blog List</h2>
      {notification && (<Notification type={notification.type} message={notification.message} />)}
      {user ?
        <div>
          <p>{user.name} logged in <button onClick={handleLogout}>Log out</button></p>
          <BlogForm
            blogs={blogs}
            setBlogs={setBlogs}
            setNotification={setNotification}
            onSubmit={handleCreateBlog}
          />
          {blogs.map(blog => (<Blog user={user} key={blog.id} blog={blog} handleLikeUpdate={handleLikeUpdate} handleDeleteBlog={handleDeleteBlog}/>))}
        </div>
        :
        <LoginForm
          handleSubmit={handleLogin} handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)} username={username}
          password={password}
        />
      }
    </div>
  )
}

export default App
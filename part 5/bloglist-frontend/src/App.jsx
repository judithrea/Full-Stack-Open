import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({ username, password })
      blogService.setToken(user.token)
      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
  }

  const handleCreateBlog = async (event) => {
    event.preventDefault()
    
    try { 
      await blogService.create({ title, author, url })
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch {
      setErrorMessage('Creation not successful')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
        <div>
          <label>
            username
            <input 
              type="text"
              value={username}
              onChange={({target}) => setUsername(target.value)} />
          </label>
        </div>
        <div>
          <label>
            password
            <input 
              type="text"
              value={password}
              onChange={({target}) => setPassword(target.value)} />
          </label>
        </div>
        <button type='submit'>Log in</button>
      </form>
  )

  const blogForm = () => (
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
  )

  return (
    <div>
      <h2>Blog List</h2>
      {user ?
        <div>
          <p>{user.name} logged in <button onClick={handleLogout}>Log out</button></p>
          <h2>create new</h2>
          {blogForm()}
          {blogs.map(blog => (<Blog key={blog.id} blog={blog} />))}
        </div>
      : 
        loginForm()
      }
    </div>
  )
}

export default App
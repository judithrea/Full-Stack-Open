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

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({ username, password })
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

  return (
    <div>
      <h2>Blog List</h2>
      {user ?
        <div>
          <p>{user.name} logged in</p>
          {blogs.map(blog => (<Blog key={blog.id} blog={blog} />))}
        </div>
      : 
        loginForm()
      }
    </div>
  )
}

export default App
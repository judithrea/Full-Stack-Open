const LoginForm = ({ handleSubmit, username, password, handlePasswordChange, handleUsernameChange }) => {

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
            username
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange} />
        </label>
      </div>
      <div>
        <label>
            password
          <input
            type="text"
            value={password}
            onChange={handlePasswordChange} />
        </label>
      </div>
      <button type='submit'>Log in</button>
    </form>
  )
}

export default LoginForm
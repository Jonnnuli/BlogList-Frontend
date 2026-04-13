import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification.jsx'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [newBlog, setNewBlog] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async event => {
    event.preventDefault()
    console.log('logging in with', username, password)

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
          'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const handleBlogChange = (event) => {
    setNewBlog(event.target.value)
  }

  const addBlog = async event => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    }
    try {
      const blog = await blogService.create(blogObject)
      setBlogs(blogs.concat(blog))

      setNewTitle('')
      setNewAuthor('')
      setNewUrl('')
    } catch {
      setErrorMessage('error creating blog')
      setTimeout(() => setErrorMessage(null), 5000)
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
                onChange={({ target }) => setUsername(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
  )

  const blogForm = () => (
      <form onSubmit={addBlog}>
        <div>
          title
          <input value={newTitle} onChange={({target}) => setNewTitle(target.value)}/>
        </div>
        <div>
          author
          <input value={newAuthor} onChange={({target}) => setNewAuthor(target.value)}/>
        </div>
        <div>
          url
          <input value={newUrl} onChange={({target}) => setNewUrl(target.value)}/>
        </div>
        <button type="submit">save</button>
      </form>
  )

  return (
      <div>
        <h2>Blogs</h2>
        <Notification message={errorMessage}/>
        {!user && loginForm()}
        {user && (
            <div>
              <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
              {blogForm()}
            </div>
        )}

        {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App
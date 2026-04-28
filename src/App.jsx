import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification.jsx'
import LoginForm from './components/LoginForm.jsx'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [infoMessage, setInfoMessage] = useState(null)
  const blogFormRef = useRef()

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

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))

      setInfoMessage(`A new blog ${blogObject.title} by ${blogObject.author} added.`)
      setTimeout(() => setInfoMessage(null), 5000)
    } catch {
      setErrorMessage('failed to create blog')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const handleLike = async (blog) => {
    const updatedBlog = {
      user: blog.user.id || blog.user,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }

    const returnedBlog = await blogService.update(blog.id, updatedBlog)

    setBlogs(blogs.map(b =>
        b.id === blog.id ? returnedBlog : b
    ))
  }

  const loginForm = () => (
      <Togglable buttonLabel="login">
        <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
        />
      </Togglable>
  )

  return (
      <div>
        <h2>Blogs</h2>
        <Notification message={errorMessage} type="error"/>
        <Notification message={infoMessage} type="success"/>
        {!user && loginForm()}
        {user && (
            <div>
              <p>{user.name} Logged in
                <button onClick={handleLogout}>Logout</button>
              </p>
              <Togglable buttonLabel="New blog" ref={blogFormRef}>
                <BlogForm createBlog={addBlog}/>
              </Togglable>
            </div>
        )}

        {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} handleLike={handleLike}/>
        )}
      </div>
  )
}

export default App
import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification.jsx'
import LoginForm from './components/LoginForm.jsx'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import BlogView from './components/BlogView'
import {
  Routes, Route, Link, useNavigate
} from 'react-router-dom'
import { Container, AppBar, Toolbar, Button } from '@mui/material'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [infoMessage, setInfoMessage] = useState(null)
  const blogFormRef = useRef()
  const navigate = useNavigate()
  const style = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }

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
      navigate('/')
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
    navigate('/')
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
    if (!user) return

    const updatedBlog = {
      user: blog.user.id || blog.user,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }

    const returnedBlog = await blogService.update(blog.id, updatedBlog)

    const blogUser = { ...returnedBlog, user: blog.user }

    setBlogs(blogs =>
      blogs
        .map(b => b.id === blog.id ? blogUser : b)
        .sort((a, b) => b.likes - a.likes)
    )
  }

  const handleDelete = async (blog) => {
    const confirmDelete = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}`
    )

    if (!confirmDelete) return

    try {
      await blogService.remove(blog.id)

      setBlogs(blogs =>
        blogs.filter(b => b.id !== blog.id)
      )
    } catch {
      setErrorMessage('failed to delete blog')
      setTimeout(() => setErrorMessage(null), 5000)
    }
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
    <Container>
      <div>
        <AppBar position="static">
          <Toolbar>
            <Button color="inherit" component={Link} to="/" sx={style}>Blogs</Button>
            {user && (
              <Button color="inherit" component={Link} to="/create" sx={style}>New Blog</Button>
            )}
            {!user && (
              <Button color="inherit" component={Link} to="/login" sx={style}>Login</Button>
            )}
            {user && (
              <span style={{ marginLeft: '1rem', marginRight: '1rem' }}>
                {user.name} Logged in
                <button onClick={handleLogout}>Logout</button>
              </span>
            )}
          </Toolbar>
        </AppBar>

        <h2>Blogs</h2>
        <Notification message={errorMessage} type="error"/>
        <Notification message={infoMessage} type="success"/>

        <Routes>
          <Route path="/" element={
            <div>
              {blogs.map(blog =>
                <Blog key={blog.id} blog={blog}/>
              )}
            </div>
          }/>
          <Route path="/create" element={
            <Togglable buttonLabel="New blog" ref={blogFormRef}>
              <BlogForm createBlog={addBlog}/>
            </Togglable>
          }/>
          <Route path="blogs/:id" element={
            <BlogView blogs={blogs} handleLike={handleLike} handleDelete={handleDelete} user={user} />
          }/>

          <Route path="/login" element={
            user ? <div>{user.name} Logged in</div> : loginForm()
          }/>
        </Routes>
      </div>
    </Container>
  )
}

export default App
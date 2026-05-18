import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, Button } from '@mui/material'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const navigate = useNavigate()

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title,
      author,
      url
    })

    navigate('/')
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={addBlog}>
        <div>
          <TextField label="Title" placeholder="title" value={title} onChange={({ target }) => setTitle(target.value)}/>
        </div>
        <div>
          <TextField label="Author" placeholder="author" value={author} onChange={({ target }) => setAuthor(target.value)}/>
        </div>
        <div>
          <TextField label="Url" placeholder="url" value={url} onChange={({ target }) => setUrl(target.value)}/>
        </div>
        <Button type="submit" variant="contained" style={{ marginTop:10 }}>Save</Button>
      </form>
    </div>
  )
}

export default BlogForm
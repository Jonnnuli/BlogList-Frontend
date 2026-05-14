import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
                    Title
          <input placeholder="title" value={title} onChange={({ target }) => setTitle(target.value)}/>
        </div>
        <div>
                    Author
          <input placeholder="author" value={author} onChange={({ target }) => setAuthor(target.value)}/>
        </div>
        <div>
                    Url
          <input placeholder="url" value={url} onChange={({ target }) => setUrl(target.value)}/>
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  )
}

export default BlogForm
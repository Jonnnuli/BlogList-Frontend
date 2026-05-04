import { useState } from 'react'

const Blog = ({ blog, handleLike, handleDelete, user }) => {
  const [showDetails, setShowDetails] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 2,
    marginBottom: 5
  }

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  return (
    <div style={blogStyle}>

      {!showDetails && (
        <div>
          <span>{blog.title}</span>
          <button onClick={toggleDetails}>View</button>
        </div>
      )}

      {showDetails && (
        <div>
          <div>
            {blog.title} {blog.author}
            <button onClick={toggleDetails}>Hide</button>
          </div>
          <div>{blog.url}</div>
          <div>
                likes {blog.likes}
            <button onClick={() => handleLike(blog)}>Like</button>
          </div>
          <div>{blog.user?.name}</div>
          {user && blog.user && (
            (blog.user.username === user.username ||
                      blog.user.id === user.id ||
                      blog.user === user.id) && (
              <button onClick={() => handleDelete(blog)}>Remove</button>
            )
          )}
        </div>
      )}

    </div>
  )
}

export default Blog
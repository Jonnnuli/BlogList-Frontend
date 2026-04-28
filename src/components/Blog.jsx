import { useState } from 'react'

const Blog = ({ blog, handleLike }) => {
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
              {blog.title} {blog.author}
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
            </div>
        )}

      </div>
  )
}

export default Blog
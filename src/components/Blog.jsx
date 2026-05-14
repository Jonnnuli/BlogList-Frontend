import { useState } from 'react'
import { Link } from 'react-router-dom'

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
    <div className="blogtest" style={blogStyle}>
      {!showDetails && (
        <div>
          <Link to={`/blogs/${blog.id}`}>{blog.title} {blog.author}</Link>
        </div>
      )}
    </div>
  )
}

export default Blog
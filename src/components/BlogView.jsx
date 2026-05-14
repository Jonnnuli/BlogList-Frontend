import { useParams, useNavigate } from 'react-router-dom'

const BlogView = ({ blogs, handleLike, handleDelete, user }) => {
  const id = useParams().id
  const blog = blogs.find(blog => blog.id === id)
  const navigate = useNavigate()
  if(!blog) {
    return null
  }

  return (
    <div>
      <h2>{blog.title} {blog.author}</h2>
      <div>{blog.url}</div>
      <div>
          likes {blog.likes}
        {user && (
          <button onClick={() => handleLike(blog)}>Like</button>
        )}
      </div>
      <div>{blog.user?.name}</div>

      {user && blog.user && (
        (blog.user.username === user.username ||
                    blog.user.id === user.id ||
                    blog.user === user.id) && (
          <button
            onClick={async () => {
              await handleDelete(blog)
              navigate('/')
            }}
          >Delete</button>
        )
      )}
    </div>
  )
}

export default BlogView
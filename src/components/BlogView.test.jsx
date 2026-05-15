import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import BlogView from './BlogView'
import { MemoryRouter, Routes, Route } from 'react-router-dom'

const blog = {
  id: '111',
  title: 'Test Title',
  author: 'Test Author',
  url: 'www.example.com',
  likes: 2,
  user: {
    id: '222',
    username: 'JonnaTesti',
    name: 'Jonna Testi'
  }
}

const renderBlog = (user, handleLike = vi.fn(), handleDelete = vi.fn()) => {
  render(
    <MemoryRouter initialEntries={['/blogs/111']}>
      <Routes>
        <Route path="/blogs/:id" element={
          <BlogView blogs={[blog]} user={user} handleLike={handleLike} handleDelete={handleDelete}
          />
        }
        />
      </Routes>
    </MemoryRouter>
  )
  return { handleLike, handleDelete }
}


test('When user not logged in, shows blogs and likes but no buttons', () => {

  renderBlog(null)
  expect(screen.getByText(/Test Title Test Author/)).toBeDefined()
  expect(screen.getByText('www.example.com')).toBeDefined()
  expect(screen.getByText('likes 2')).toBeDefined()

  expect(screen.queryByText('Like')).toBeNull()
  expect(screen.queryByText('Delete')).toBeNull()
})

test('User sees like button but no delete button, if not blogs creator', async () => {
  const user = userEvent.setup()
  const handleLike = vi.fn()

  renderBlog({ id: '333', username: 'NotCreator' }, handleLike)
  const likeButton = screen.getByText('Like')
  await user.click(likeButton)

  expect(handleLike).toHaveBeenCalledTimes(1)
  expect(screen.queryByText('Delete')).toBeNull()
})

test('Creator sees delete button', () => {
  renderBlog({ id: '222', username: 'JonnaTesti' })
  expect(screen.getByText('Delete')).toBeDefined()
})
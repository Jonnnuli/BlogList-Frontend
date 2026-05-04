import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { vi } from 'vitest'
import BlogForm from './BlogForm'

test('renders content', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Author',
    url: 'www.example.com',
    likes: 1,
    user: {
      name: 'TestiJonna'
    }
  }

  render(<Blog blog={blog} />)

  const element = screen.getByText('Component testing is done with react-testing-library')
  expect(element).toBeDefined()
})

test('clicking the button shows url, likes and user', async () => {
  const blog = {
    title: 'Test blog',
    author: 'Test author',
    url: 'www.example.com',
    likes: 1,
    user: {
      name: 'TestiJonna'
    }
  }

  render(<Blog blog={blog} />)

  const user = userEvent.setup()
  const button = screen.getByText('View')
  await user.click(button)

  expect(screen.getByText('www.example.com')).toBeDefined()
  expect(screen.getByText('likes 1')).toBeDefined()
  expect(screen.getByText('TestiJonna')).toBeDefined()
})


test('clicking button "Like" twice calls event handler twice', async () => {
  const blog = {
    title: 'Test blog',
    author: 'Test author',
    url: 'www.example.com',
    likes: 1,
    user: {
      name: 'TestiJonna'
    }
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} handleLike={mockHandler} />)

  const user = userEvent.setup()
  const viewButton = screen.getByText('View')
  await user.click(viewButton)

  const likeButton = screen.getByText('Like')

  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})

test('createBlog is called with correct data', async () => {
  const createBlog = vi.fn()

  render(<BlogForm createBlog={createBlog} />)

  const user = userEvent.setup()

  await user.type(screen.getByPlaceholderText('title'), 'New blog')
  await user.type(screen.getByPlaceholderText('author'), 'Testi Author')
  await user.type(screen.getByPlaceholderText('url'), 'www.example.com')

  await user.click(screen.getByText('Save'))

  expect(createBlog).toHaveBeenCalledTimes(1)

  expect(createBlog).toHaveBeenCalledWith({
    title: 'New blog',
    author: 'Testi Author',
    url: 'www.example.com'
  })
})
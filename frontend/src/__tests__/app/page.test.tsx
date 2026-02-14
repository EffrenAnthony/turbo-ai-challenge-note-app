import { render, screen } from '@testing-library/react'
import HomePage from '@/app/page'

describe('HomePage', () => {
  it('renders the heading', () => {
    render(<HomePage />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Notes App')
  })

  it('renders sign in and register links', () => {
    render(<HomePage />)
    expect(screen.getByRole('link', { name: /sign in/i })).toHaveAttribute('href', '/login')
    expect(screen.getByRole('link', { name: /register/i })).toHaveAttribute('href', '/register')
  })
})

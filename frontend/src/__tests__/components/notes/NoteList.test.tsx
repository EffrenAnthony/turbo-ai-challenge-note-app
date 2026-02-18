import { render, screen } from '@testing-library/react'
import { NoteList } from '@/components/notes/NoteList'
import { mockNotes, mockCategories } from '@/__tests__/mocks/data'

jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
})

jest.mock('next/image', () => {
  return ({ alt, ...props }: { alt: string; [key: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} {...props} />
  )
})

describe('NoteList', () => {
  it('renders empty state when no notes', () => {
    render(<NoteList notes={[]} categories={mockCategories} />)
    expect(
      screen.getByText("I'm just here waiting for your charming notes..."),
    ).toBeInTheDocument()
    expect(screen.getByAltText('Waiting for notes')).toBeInTheDocument()
  })

  it('renders all notes', () => {
    render(<NoteList notes={mockNotes} categories={mockCategories} />)
    expect(screen.getByText('First Note')).toBeInTheDocument()
    expect(screen.getByText('Second Note')).toBeInTheDocument()
    expect(screen.getByText('Third Note')).toBeInTheDocument()
  })

  it('renders notes sorted by created_at descending', () => {
    render(<NoteList notes={mockNotes} categories={mockCategories} />)
    const links = screen.getAllByRole('link')
    expect(links[0]).toHaveAttribute('href', '/notes/1')
    expect(links[1]).toHaveAttribute('href', '/notes/2')
    expect(links[2]).toHaveAttribute('href', '/notes/3')
  })

  it('does not render empty state image when notes exist', () => {
    render(<NoteList notes={mockNotes} categories={mockCategories} />)
    expect(screen.queryByAltText('Waiting for notes')).toBeNull()
  })
})

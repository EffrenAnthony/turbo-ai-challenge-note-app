import { render, screen } from '@testing-library/react'
import { NoteCard } from '@/components/notes/NoteCard'
import { mockNotes } from '@/__tests__/mocks/data'

jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
})

describe('NoteCard', () => {
  const note = mockNotes[0]

  it('renders the note title', () => {
    render(<NoteCard note={note} />)
    expect(screen.getByText('First Note')).toBeInTheDocument()
  })

  it('renders the note content', () => {
    render(<NoteCard note={note} />)
    expect(screen.getByText('Some content here')).toBeInTheDocument()
  })

  it('renders the category name', () => {
    render(<NoteCard note={note} />)
    expect(screen.getByText('Personal')).toBeInTheDocument()
  })

  it('links to the note detail page', () => {
    render(<NoteCard note={note} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/notes/1')
  })

  it('renders bullet points as formatted content', () => {
    render(<NoteCard note={mockNotes[1]} />)
    expect(screen.getByText('Bullet one')).toBeInTheDocument()
    expect(screen.getByText('Bullet two')).toBeInTheDocument()
    expect(screen.getByText('Regular line')).toBeInTheDocument()
  })

  it('displays smart date', () => {
    render(<NoteCard note={note} />)
    const dateElement = screen.getByText((text) =>
      ['today', 'yesterday', 'February'].some((d) => text.toLowerCase().includes(d.toLowerCase())),
    )
    expect(dateElement).toBeInTheDocument()
  })
})

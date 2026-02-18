import { render, screen } from '@testing-library/react'
import { Card } from '@/components/ui/Card'

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>)
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('defaults to jade color', () => {
    const { container } = render(<Card>Content</Card>)
    const card = container.firstChild as HTMLElement
    expect(card.className).toContain('border-jade-400')
  })

  it('applies sunset color', () => {
    const { container } = render(<Card color="sunset">Content</Card>)
    const card = container.firstChild as HTMLElement
    expect(card.className).toContain('border-sunset-400')
  })

  it('applies honey color', () => {
    const { container } = render(<Card color="honey">Content</Card>)
    const card = container.firstChild as HTMLElement
    expect(card.className).toContain('border-honey-400')
  })

  it('applies sage color', () => {
    const { container } = render(<Card color="sage">Content</Card>)
    const card = container.firstChild as HTMLElement
    expect(card.className).toContain('border-sage-300')
  })

  it('applies custom className', () => {
    const { container } = render(<Card className="extra-class">Content</Card>)
    const card = container.firstChild as HTMLElement
    expect(card.className).toContain('extra-class')
  })

  it('passes HTML attributes through', () => {
    render(<Card data-testid="my-card">Content</Card>)
    expect(screen.getByTestId('my-card')).toBeInTheDocument()
  })
})

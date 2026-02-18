import { render, screen } from '@testing-library/react'
import { Spinner } from '@/components/ui/Spinner'

describe('Spinner', () => {
  it('renders with status role', () => {
    render(<Spinner />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('has accessible loading label', () => {
    render(<Spinner />)
    expect(screen.getByLabelText('Loading')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Spinner className="h-8 w-8" />)
    const spinner = screen.getByRole('status')
    expect(spinner.className).toContain('h-8')
    expect(spinner.className).toContain('w-8')
  })
})

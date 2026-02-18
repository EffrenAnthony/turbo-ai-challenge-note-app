import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CategoryDropdown } from '@/components/forms/CategoryDropdown'
import { mockCategories } from '@/__tests__/mocks/data'

describe('CategoryDropdown', () => {
  const defaultProps = {
    categories: mockCategories,
    selectedCategoryId: 1,
    selectedIndex: 0,
    onSelect: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders with selected category name', () => {
    render(<CategoryDropdown {...defaultProps} />)
    expect(screen.getByText('Personal')).toBeInTheDocument()
  })

  it('shows "Select category" when no match', () => {
    render(<CategoryDropdown {...defaultProps} selectedCategoryId={999} />)
    expect(screen.getByText('Select category')).toBeInTheDocument()
  })

  it('opens dropdown on click', async () => {
    const user = userEvent.setup()
    render(<CategoryDropdown {...defaultProps} />)

    await user.click(screen.getByRole('button', { name: /Personal/i }))
    expect(screen.getByText('School')).toBeInTheDocument()
    expect(screen.getByText('Drama')).toBeInTheDocument()
  })

  it('does not show selected category in dropdown options', async () => {
    const user = userEvent.setup()
    render(<CategoryDropdown {...defaultProps} />)

    await user.click(screen.getByRole('button', { name: /Personal/i }))
    const dropdownButtons = screen.getAllByRole('button')
    const optionTexts = dropdownButtons.slice(1).map((btn) => btn.textContent)
    expect(optionTexts).not.toContain('Personal')
  })

  it('calls onSelect when an option is clicked', async () => {
    const user = userEvent.setup()
    render(<CategoryDropdown {...defaultProps} />)

    await user.click(screen.getByRole('button', { name: /Personal/i }))
    await user.click(screen.getByText('School'))
    expect(defaultProps.onSelect).toHaveBeenCalledWith(mockCategories[1])
  })

  it('closes dropdown after selection', async () => {
    const user = userEvent.setup()
    render(<CategoryDropdown {...defaultProps} />)

    await user.click(screen.getByRole('button', { name: /Personal/i }))
    expect(screen.getByText('School')).toBeInTheDocument()

    await user.click(screen.getByText('School'))
    expect(screen.queryByText('Drama')).toBeNull()
  })

  it('closes dropdown on click outside', async () => {
    const user = userEvent.setup()
    render(
      <div>
        <CategoryDropdown {...defaultProps} />
        <button>Outside</button>
      </div>,
    )

    await user.click(screen.getByRole('button', { name: /Personal/i }))
    expect(screen.getByText('School')).toBeInTheDocument()

    await user.click(screen.getByText('Outside'))
    expect(screen.queryByText('School')).toBeNull()
  })
})

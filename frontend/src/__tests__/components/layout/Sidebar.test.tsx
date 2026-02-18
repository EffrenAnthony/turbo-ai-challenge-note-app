import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Sidebar } from '@/components/layout/Sidebar'
import { mockCategories, mockNotes } from '@/__tests__/mocks/data'

const mockPush = jest.fn()
const mockLogoutUser = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

jest.mock('@/lib/hooks/useCategories', () => ({
  useCategories: () => ({
    data: [
      { id: 1, name: 'Personal', created_at: '', updated_at: '' },
      { id: 2, name: 'School', created_at: '', updated_at: '' },
      { id: 3, name: 'Drama', created_at: '', updated_at: '' },
    ],
    isLoading: false,
  }),
}))

jest.mock('@/lib/hooks/useNotes', () => ({
  useNotes: () => ({
    data: {
      results: [
        {
          id: 1,
          title: 'Note 1',
          content: 'Content',
          category: { id: 1, name: 'Personal', created_at: '', updated_at: '' },
          created_at: '2026-02-18T10:00:00Z',
          updated_at: '2026-02-18T10:00:00Z',
        },
        {
          id: 2,
          title: 'Note 2',
          content: 'Content',
          category: { id: 1, name: 'Personal', created_at: '', updated_at: '' },
          created_at: '2026-02-17T10:00:00Z',
          updated_at: '2026-02-17T10:00:00Z',
        },
      ],
    },
  }),
}))

jest.mock('@/lib/hooks/useAuth', () => ({
  useAuth: () => ({ logoutUser: mockLogoutUser }),
}))

describe('Sidebar', () => {
  const defaultProps = {
    selectedCategoryId: null as number | null,
    onSelectCategory: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders "All Categories" heading', () => {
    render(<Sidebar {...defaultProps} />)
    expect(screen.getByText('All Categories')).toBeInTheDocument()
  })

  it('renders all category names', () => {
    render(<Sidebar {...defaultProps} />)
    expect(screen.getByText('Personal')).toBeInTheDocument()
    expect(screen.getByText('School')).toBeInTheDocument()
    expect(screen.getByText('Drama')).toBeInTheDocument()
  })

  it('shows note count per category', () => {
    render(<Sidebar {...defaultProps} />)
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getAllByText('0')).toHaveLength(2)
  })

  it('calls onSelectCategory when a category is clicked', async () => {
    const user = userEvent.setup()
    render(<Sidebar {...defaultProps} />)

    await user.click(screen.getByText('Personal'))
    expect(defaultProps.onSelectCategory).toHaveBeenCalledWith(1)
  })

  it('deselects category when clicking the already selected one', async () => {
    const user = userEvent.setup()
    render(<Sidebar {...defaultProps} selectedCategoryId={1} />)

    await user.click(screen.getByText('Personal'))
    expect(defaultProps.onSelectCategory).toHaveBeenCalledWith(null)
  })

  it('renders logout button', () => {
    render(<Sidebar {...defaultProps} />)
    expect(screen.getByText('Log out')).toBeInTheDocument()
  })

  it('calls logoutUser and redirects on logout', async () => {
    const user = userEvent.setup()
    render(<Sidebar {...defaultProps} />)

    await user.click(screen.getByText('Log out'))
    expect(mockLogoutUser).toHaveBeenCalled()
    expect(mockPush).toHaveBeenCalledWith('/login')
  })
})

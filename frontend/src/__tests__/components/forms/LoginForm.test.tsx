import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LoginForm } from '@/components/forms/LoginForm'

const mockPush = jest.fn()
const mockLoginUser = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

jest.mock('@/lib/hooks/useAuth', () => ({
  useAuth: () => ({ loginUser: mockLoginUser }),
}))

jest.mock('@/lib/api/auth', () => ({
  login: jest.fn(),
}))

function renderWithProviders(ui: React.ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders email and password inputs', () => {
    renderWithProviders(<LoginForm />)
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
  })

  it('renders login button', () => {
    renderWithProviders(<LoginForm />)
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
  })

  it('shows email error on submit with empty email', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoginForm />)

    const passwordInput = screen.getByPlaceholderText('Password')
    await user.type(passwordInput, 'somepassword')
    await user.click(screen.getByRole('button', { name: 'Login' }))

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument()
    })
  })

  it('shows email validation error for invalid email', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoginForm />)

    const emailInput = screen.getByPlaceholderText('Email address')
    await user.type(emailInput, 'notanemail')
    await user.tab()

    await waitFor(() => {
      expect(screen.getByText('Invalid email address')).toBeInTheDocument()
    })
  })

  it('shows password error on submit with empty password', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoginForm />)

    const emailInput = screen.getByPlaceholderText('Email address')
    await user.type(emailInput, 'test@example.com')
    await user.click(screen.getByRole('button', { name: 'Login' }))

    await waitFor(() => {
      expect(screen.getByText('Password is required')).toBeInTheDocument()
    })
  })
})

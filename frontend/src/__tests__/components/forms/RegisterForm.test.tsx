import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RegisterForm } from '@/components/forms/RegisterForm'

const mockPush = jest.fn()
const mockLoginUser = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

jest.mock('@/lib/hooks/useAuth', () => ({
  useAuth: () => ({ loginUser: mockLoginUser }),
}))

jest.mock('@/lib/api/auth', () => ({
  register: jest.fn(),
}))

function renderWithProviders(ui: React.ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}

describe('RegisterForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders email and password inputs', () => {
    renderWithProviders(<RegisterForm />)
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
  })

  it('renders sign up button', () => {
    renderWithProviders(<RegisterForm />)
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument()
  })

  it('shows email error on submit with empty email', async () => {
    const user = userEvent.setup()
    renderWithProviders(<RegisterForm />)

    const passwordInput = screen.getByPlaceholderText('Password')
    await user.type(passwordInput, 'StrongP@ss1')
    await user.click(screen.getByRole('button', { name: 'Sign Up' }))

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument()
    })
  })

  it('shows password strength error for weak password', async () => {
    const user = userEvent.setup()
    renderWithProviders(<RegisterForm />)

    const emailInput = screen.getByPlaceholderText('Email address')
    const passwordInput = screen.getByPlaceholderText('Password')
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'weak')
    await user.tab()

    await waitFor(() => {
      expect(screen.getByText('At least 8 characters')).toBeInTheDocument()
    })
  })

  it('shows error for password without uppercase', async () => {
    const user = userEvent.setup()
    renderWithProviders(<RegisterForm />)

    const emailInput = screen.getByPlaceholderText('Email address')
    const passwordInput = screen.getByPlaceholderText('Password')
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'lowercase1!')
    await user.tab()

    await waitFor(() => {
      expect(screen.getByText('At least one uppercase letter')).toBeInTheDocument()
    })
  })
})

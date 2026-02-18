import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '@/components/ui/Input'

describe('Input', () => {
  it('renders an input element', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('renders a label when provided', () => {
    render(<Input label="Email" id="email" />)
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })

  it('does not render a label when not provided', () => {
    const { container } = render(<Input />)
    expect(container.querySelector('label')).toBeNull()
  })

  it('displays error message', () => {
    render(<Input error="This field is required" />)
    expect(screen.getByText('This field is required')).toBeInTheDocument()
  })

  it('does not display error when not provided', () => {
    const { container } = render(<Input />)
    expect(container.querySelector('p')).toBeNull()
  })

  it('accepts typed input', async () => {
    const user = userEvent.setup()
    const handleChange = jest.fn()
    render(<Input placeholder="Type here" onChange={handleChange} />)

    await user.type(screen.getByPlaceholderText('Type here'), 'hello')
    expect(handleChange).toHaveBeenCalled()
  })

  it('renders password toggle button for password type', () => {
    render(<Input type="password" placeholder="Password" />)
    expect(screen.getByLabelText('Show password')).toBeInTheDocument()
  })

  it('does not render password toggle for text type', () => {
    render(<Input type="text" placeholder="Text" />)
    expect(screen.queryByLabelText('Show password')).toBeNull()
    expect(screen.queryByLabelText('Hide password')).toBeNull()
  })

  it('toggles password visibility on click', async () => {
    const user = userEvent.setup()
    render(<Input type="password" placeholder="Password" />)

    const input = screen.getByPlaceholderText('Password')
    expect(input).toHaveAttribute('type', 'password')

    await user.click(screen.getByLabelText('Show password'))
    expect(input).toHaveAttribute('type', 'text')
    expect(screen.getByLabelText('Hide password')).toBeInTheDocument()

    await user.click(screen.getByLabelText('Hide password'))
    expect(input).toHaveAttribute('type', 'password')
  })

  it('passes additional HTML attributes', () => {
    render(<Input data-testid="my-input" name="email" />)
    const input = screen.getByTestId('my-input')
    expect(input).toHaveAttribute('name', 'email')
  })
})

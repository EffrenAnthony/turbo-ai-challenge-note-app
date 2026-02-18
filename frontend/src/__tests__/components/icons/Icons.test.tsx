import { render } from '@testing-library/react'
import {
  EyeIcon,
  EyeOffIcon,
  ChevronDownIcon,
  CloseIcon,
  MicrophoneIcon,
  PlusIcon,
} from '@/components/icons'

const icons = [
  { name: 'EyeIcon', Component: EyeIcon },
  { name: 'EyeOffIcon', Component: EyeOffIcon },
  { name: 'ChevronDownIcon', Component: ChevronDownIcon },
  { name: 'CloseIcon', Component: CloseIcon },
  { name: 'MicrophoneIcon', Component: MicrophoneIcon },
  { name: 'PlusIcon', Component: PlusIcon },
]

describe.each(icons)('$name', ({ Component }) => {
  it('renders an SVG element', () => {
    const { container } = render(<Component />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<Component className="h-6 w-6" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('h-6')
    expect(svg).toHaveClass('w-6')
  })
})

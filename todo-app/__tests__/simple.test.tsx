import React from 'react'
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/Button'

describe('Simple Component Test', () => {
  it('renders a button', () => {
    render(<Button>Test Button</Button>)
    expect(screen.getByText('Test Button')).toBeInTheDocument()
  })

  it('renders a button with variant', () => {
    render(<Button variant="destructive">Delete</Button>)
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })
})

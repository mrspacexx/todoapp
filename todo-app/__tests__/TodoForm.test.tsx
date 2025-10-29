import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoForm } from '@/components/TodoForm'
import { Todo } from '@/types/todo'

// Mock todo data
const mockTodo: Todo = {
  id: 1,
  title: 'Test Todo',
  description: 'This is a test todo description',
  status: 'todo',
  priority: 'medium',
  due_date: '2024-12-31T00:00:00.000Z',
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
  tags: [
    { id: 1, name: 'Test Tag', color: '#3B82F6', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' }
  ]
}

const mockHandlers = {
  onSubmit: jest.fn(),
  onCancel: jest.fn(),
}

describe('TodoForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders create form when no todo is provided', () => {
    render(
      <TodoForm
        onSubmit={mockHandlers.onSubmit}
        onCancel={mockHandlers.onCancel}
      />
    )

    expect(screen.getByText('Yeni Todo Oluştur')).toBeInTheDocument()
    expect(screen.getByDisplayValue('')).toBeInTheDocument() // Empty title input
  })

  it('renders edit form when todo is provided', () => {
    render(
      <TodoForm
        todo={mockTodo}
        onSubmit={mockHandlers.onSubmit}
        onCancel={mockHandlers.onCancel}
      />
    )

    expect(screen.getByText('Todo Düzenle')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument()
    expect(screen.getByDisplayValue('This is a test todo description')).toBeInTheDocument()
  })

  it('calls onSubmit with form data when form is submitted', async () => {
    const user = userEvent.setup()
    render(
      <TodoForm
        onSubmit={mockHandlers.onSubmit}
        onCancel={mockHandlers.onCancel}
      />
    )

    // Fill in the form
    await user.type(screen.getByLabelText(/başlık/i), 'New Todo')
    await user.type(screen.getByLabelText(/açıklama/i), 'New description')
    await user.selectOptions(screen.getByLabelText(/öncelik/i), 'high')
    await user.type(screen.getByLabelText(/tarih/i), '2024-12-31')

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /oluştur/i })
    await user.click(submitButton)

    expect(mockHandlers.onSubmit).toHaveBeenCalledWith({
      title: 'New Todo',
      description: 'New description',
      priority: 'high',
      due_date: '2024-12-31',
      tags: [],
    })
  })

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <TodoForm
        onSubmit={mockHandlers.onSubmit}
        onCancel={mockHandlers.onCancel}
      />
    )

    const cancelButton = screen.getByRole('button', { name: /iptal/i })
    await user.click(cancelButton)

    expect(mockHandlers.onCancel).toHaveBeenCalled()
  })

  it('shows validation error for empty title', async () => {
    const user = userEvent.setup()
    render(
      <TodoForm
        onSubmit={mockHandlers.onSubmit}
        onCancel={mockHandlers.onCancel}
      />
    )

    // Try to submit without title
    const submitButton = screen.getByRole('button', { name: /oluştur/i })
    await user.click(submitButton)

    expect(screen.getByText('Başlık gereklidir')).toBeInTheDocument()
    expect(mockHandlers.onSubmit).not.toHaveBeenCalled()
  })

  it('shows validation error for empty priority', async () => {
    const user = userEvent.setup()
    render(
      <TodoForm
        onSubmit={mockHandlers.onSubmit}
        onCancel={mockHandlers.onCancel}
      />
    )

    // Fill title but not priority
    await user.type(screen.getByLabelText(/başlık/i), 'Test Todo')
    
    const submitButton = screen.getByRole('button', { name: /oluştur/i })
    await user.click(submitButton)

    expect(screen.getByText('Öncelik gereklidir')).toBeInTheDocument()
    expect(mockHandlers.onSubmit).not.toHaveBeenCalled()
  })

  it('pre-fills form data when editing existing todo', () => {
    render(
      <TodoForm
        todo={mockTodo}
        onSubmit={mockHandlers.onSubmit}
        onCancel={mockHandlers.onCancel}
      />
    )

    expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument()
    expect(screen.getByDisplayValue('This is a test todo description')).toBeInTheDocument()
    expect(screen.getByDisplayValue('medium')).toBeInTheDocument()
  })
})
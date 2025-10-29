import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoCard } from '@/components/TodoCard'
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
  onEdit: jest.fn(),
  onDelete: jest.fn(),
  onStatusChange: jest.fn(),
  onSelect: jest.fn(),
}

describe('TodoCard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders todo information correctly', () => {
    render(
      <TodoCard
        todo={mockTodo}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onStatusChange={mockHandlers.onStatusChange}
      />
    )

    expect(screen.getByText('Test Todo')).toBeInTheDocument()
    expect(screen.getByText('This is a test todo description')).toBeInTheDocument()
    expect(screen.getAllByText('Yapılacak')[0]).toBeInTheDocument()
    expect(screen.getByText('Orta')).toBeInTheDocument()
    expect(screen.getByText('Test Tag')).toBeInTheDocument()
  })

  it('calls onEdit when edit button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <TodoCard
        todo={mockTodo}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onStatusChange={mockHandlers.onStatusChange}
      />
    )

    const editButton = screen.getAllByRole('button')[0]
    await user.click(editButton)

    expect(mockHandlers.onEdit).toHaveBeenCalledWith(mockTodo)
  })

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <TodoCard
        todo={mockTodo}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onStatusChange={mockHandlers.onStatusChange}
      />
    )

    const deleteButton = screen.getAllByRole('button')[1]
    await user.click(deleteButton)

    expect(mockHandlers.onDelete).toHaveBeenCalledWith(1)
  })

  it('calls onStatusChange when status is changed', async () => {
    const user = userEvent.setup()
    render(
      <TodoCard
        todo={mockTodo}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onStatusChange={mockHandlers.onStatusChange}
      />
    )

    const statusSelect = screen.getByDisplayValue('Yapılacak')
    await user.selectOptions(statusSelect, 'in_progress')

    expect(mockHandlers.onStatusChange).toHaveBeenCalledWith(1, 'in_progress')
  })

  it('renders checkbox when onSelect is provided', () => {
    render(
      <TodoCard
        todo={mockTodo}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onStatusChange={mockHandlers.onStatusChange}
        onSelect={mockHandlers.onSelect}
        selected={false}
      />
    )

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeInTheDocument()
    expect(checkbox).not.toBeChecked()
  })

  it('calls onSelect when checkbox is clicked', async () => {
    const user = userEvent.setup()
    render(
      <TodoCard
        todo={mockTodo}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onStatusChange={mockHandlers.onStatusChange}
        onSelect={mockHandlers.onSelect}
        selected={false}
      />
    )

    const checkbox = screen.getByRole('checkbox')
    await user.click(checkbox)

    expect(mockHandlers.onSelect).toHaveBeenCalledWith(1, true)
  })

  it('shows selected state when selected prop is true', () => {
    render(
      <TodoCard
        todo={mockTodo}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onStatusChange={mockHandlers.onStatusChange}
        onSelect={mockHandlers.onSelect}
        selected={true}
      />
    )

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeChecked()
  })

  it('renders in compact mode', () => {
    render(
      <TodoCard
        todo={mockTodo}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onStatusChange={mockHandlers.onStatusChange}
        compact={true}
      />
    )

    // In compact mode, description should not be visible
    expect(screen.queryByText('This is a test todo description')).not.toBeInTheDocument()
  })

  it('renders without description when description is empty', () => {
    const todoWithoutDescription = { ...mockTodo, description: '' }
    
    render(
      <TodoCard
        todo={todoWithoutDescription}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onStatusChange={mockHandlers.onStatusChange}
      />
    )

    expect(screen.queryByText('This is a test todo description')).not.toBeInTheDocument()
  })

  it('renders without tags when tags array is empty', () => {
    const todoWithoutTags = { ...mockTodo, tags: [] }
    
    render(
      <TodoCard
        todo={todoWithoutTags}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onStatusChange={mockHandlers.onStatusChange}
      />
    )

    expect(screen.queryByText('Test Tag')).not.toBeInTheDocument()
  })
})

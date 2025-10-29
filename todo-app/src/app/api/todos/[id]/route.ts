import { NextRequest, NextResponse } from 'next/server'
import { todoApi } from '@/lib/api'
import { updateTodoSchema } from '@/lib/schemas'

// GET /api/todos/[id] - Get single todo
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { message: 'Invalid todo ID' },
        { status: 400 }
      )
    }
    
    const todo = await todoApi.getTodo(id)
    
    return NextResponse.json(todo)
  } catch (error) {
    console.error('Error fetching todo:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/todos/[id] - Update todo
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { message: 'Invalid todo ID' },
        { status: 400 }
      )
    }
    
    const body = await request.json()
    
    // Validate input
    const validatedData = updateTodoSchema.parse(body)
    
    const todo = await todoApi.updateTodo(id, validatedData)
    
    return NextResponse.json(todo)
  } catch (error) {
    console.error('Error updating todo:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/todos/[id] - Delete todo
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { message: 'Invalid todo ID' },
        { status: 400 }
      )
    }
    
    await todoApi.deleteTodo(id)
    
    return NextResponse.json({ message: 'Todo deleted successfully' })
  } catch (error) {
    console.error('Error deleting todo:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { todoApi } from '@/lib/api'
import { todoFiltersSchema, createTodoSchema } from '@/lib/schemas'

// GET /api/todos - Get all todos with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const filters = {
      status: searchParams.get('status')?.split(','),
      priority: searchParams.get('priority')?.split(','),
      search: searchParams.get('search') || undefined,
      sort: searchParams.get('sort') || undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
    }

    // Validate filters
    const validatedFilters = todoFiltersSchema.parse(filters)
    
    const todos = await todoApi.getTodos(validatedFilters)
    
    return NextResponse.json(todos)
  } catch (error) {
    console.error('Error fetching todos:', error)
    
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

// POST /api/todos - Create new todo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = createTodoSchema.parse(body)
    
    const todo = await todoApi.createTodo(validatedData)
    
    return NextResponse.json(todo, { status: 201 })
  } catch (error) {
    console.error('Error creating todo:', error)
    
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

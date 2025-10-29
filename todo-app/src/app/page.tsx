'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Todo, TodoFilters, CreateTodoRequest } from '@/types/todo'
import { useTodos } from '@/hooks/useTodos'
import { todoApi } from '@/lib/api'
import { TodoList } from '@/components/TodoList'
import { KanbanBoard } from '@/components/KanbanBoard'
import { FilterBar } from '@/components/FilterBar'
import { Pagination } from '@/components/Pagination'
import { Modal } from '@/components/ui/Modal'
import { TodoForm } from '@/components/TodoForm'
import { Button } from '@/components/ui/Button'
import { Toast } from '@/components/ui/Toast'
import { BulkActionsToolbar } from '@/components/BulkActionsToolbar'
import { Chatbot } from '@/components/Chatbot'
import { CheckCircle, AlertCircle, Plus, Filter, Grid, List, Clock, Kanban } from 'lucide-react'

export default function HomePage() {
  const [filters, setFilters] = useState<TodoFilters>({
    page: 1,
    limit: 12,
  })
  const [showModal, setShowModal] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | undefined>()
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'kanban'>('grid')
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info'
    message: string
  } | null>(null)
  const [selectedTodos, setSelectedTodos] = useState<Set<number>>(new Set())

  const { todos, loading, error, meta, createTodo, updateTodo, deleteTodo, refetch } = useTodos(filters)

  const getStatusCount = (status: string) => {
    return todos.filter(todo => todo.status === status).length
  }

  const getPriorityCount = (priority: string) => {
    return todos.filter(todo => todo.priority === priority).length
  }

  const handleCreateTodo = async (todoData: CreateTodoRequest) => {
    try {
      await createTodo(todoData)
      setShowModal(false)
      setEditingTodo(undefined)
      showNotification('success', 'Todo başarıyla oluşturuldu!')
    } catch (error) {
      showNotification('error', 'Todo oluşturulurken hata oluştu!')
    }
  }

  const handleUpdateTodo = async (todoData: CreateTodoRequest) => {
    if (!editingTodo) return

    try {
      await updateTodo(editingTodo.id, todoData as any)
      setShowModal(false)
      setEditingTodo(undefined)
      showNotification('success', 'Todo başarıyla güncellendi!')
    } catch (error) {
      showNotification('error', 'Todo güncellenirken hata oluştu!')
    }
  }

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo)
    setShowModal(true)
  }

  const handleDeleteTodo = async (id: number) => {
    if (window.confirm('Bu todo\'yu silmek istediğinizden emin misiniz?')) {
      try {
        await deleteTodo(id)
        showNotification('success', 'Todo başarıyla silindi!')
      } catch (error) {
        showNotification('error', 'Todo silinirken hata oluştu!')
      }
    }
  }

  // Bulk operations
  const handleSelectTodo = (id: number, selected: boolean) => {
    const newSelected = new Set(selectedTodos)
    if (selected) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedTodos(newSelected)
  }

  const handleBulkDelete = async () => {
    if (selectedTodos.size === 0) return
    
    if (window.confirm(`${selectedTodos.size} todo'yu silmek istediğinizden emin misiniz?`)) {
      try {
        const result = await todoApi.bulkDeleteTodos(Array.from(selectedTodos))
        showNotification('success', result.message)
        await refetch() // Önce refetch yap
        setSelectedTodos(new Set()) // Sonra seçimi temizle
      } catch (error) {
        showNotification('error', 'Toplu silme işlemi başarısız!')
      }
    }
  }

  const handleBulkStatusChange = async (status: string) => {
    if (selectedTodos.size === 0 || !status) return
    
    try {
      const result = await todoApi.bulkUpdateStatus(Array.from(selectedTodos), status)
      showNotification('success', result.message)
      await refetch() // Önce refetch yap
      setSelectedTodos(new Set()) // Sonra seçimi temizle
    } catch (error) {
      showNotification('error', 'Toplu status güncelleme başarısız!')
    }
  }

  const handleBulkPriorityChange = async (priority: string) => {
    if (selectedTodos.size === 0 || !priority) return
    
    try {
      const result = await todoApi.bulkUpdatePriority(Array.from(selectedTodos), priority)
      showNotification('success', result.message)
      await refetch() // Önce refetch yap
      setSelectedTodos(new Set()) // Sonra seçimi temizle
    } catch (error) {
      showNotification('error', 'Toplu öncelik güncelleme başarısız!')
    }
  }

  const handleClearSelection = () => {
    setSelectedTodos(new Set())
  }

  const handleStatusChange = async (id: number, status: Todo['status']) => {
    try {
      await updateTodo(id, { status })
      showNotification('success', 'Todo durumu güncellendi!')
    } catch (error) {
      showNotification('error', 'Todo durumu güncellenirken hata oluştu!')
    }
  }

  const handleFiltersChange = (newFilters: TodoFilters) => {
    setFilters(newFilters)
  }

  const handleClearFilters = () => {
    setFilters({ page: 1, limit: 12 })
  }

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }

  const handleCreateNew = () => {
    setEditingTodo(undefined)
    setShowModal(true)
  }

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Profesyonel Arka Plan */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-indigo-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-xl shadow-2xl border-b border-white/20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white/20">
                <Image 
                  src="/ethis-logo.jpg" 
                  alt="ETHIS STAJYER Logo" 
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Todo Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 font-medium hidden sm:block">ETHIS Stajyer Projesi</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="flex bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Liste Görünümü"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Grid Görünümü"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('kanban')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'kanban' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Kanban Görünümü"
                >
                  <Kanban className="w-4 h-4" />
                </button>
              </div>

              {/* Add Todo Button */}
              <Button
                onClick={handleCreateNew}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-4 h-4 mr-2" />
                Yeni Todo
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="group bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 hover:bg-white/90 hover:shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Toplam Todo</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mt-2">{todos.length}</p>
                <p className="text-xs text-slate-500 mt-1">Aktif görevler</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <span className="text-3xl">📝</span>
              </div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 hover:bg-white/90 hover:shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Tamamlanan</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent mt-2">{getStatusCount('done')}</p>
                <p className="text-xs text-slate-500 mt-1">Başarıyla tamamlandı</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <span className="text-3xl">✅</span>
              </div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 hover:bg-white/90 hover:shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Devam Eden</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mt-2">{getStatusCount('in_progress')}</p>
                <p className="text-xs text-slate-500 mt-1">İşlemde olanlar</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <span className="text-3xl">⏳</span>
              </div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 hover:bg-white/90 hover:shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Yüksek Öncelik</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mt-2">{getPriorityCount('high')}</p>
                <p className="text-xs text-slate-500 mt-1">Acil görevler</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <span className="text-3xl">🔥</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200/50 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center">
              <Filter className="w-5 h-5 mr-2 text-slate-600" />
              Filtreler ve Arama
            </h2>
            <button
              onClick={refetch}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Yenile
            </button>
          </div>
          <FilterBar
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Bulk Actions Toolbar */}
        <BulkActionsToolbar
          selectedCount={selectedTodos.size}
          onBulkDelete={handleBulkDelete}
          onBulkStatusChange={handleBulkStatusChange}
          onBulkPriorityChange={handleBulkPriorityChange}
          onClearSelection={handleClearSelection}
        />

        {/* Todo List */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200/50 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Todo Listesi</h2>
            <p className="text-sm text-slate-600 mt-1">
              {todos.length} todo bulundu
            </p>
          </div>
          
          {viewMode === 'kanban' ? (
            <KanbanBoard
              todos={todos}
              loading={loading}
              error={error}
              onEdit={handleEditTodo}
              onDelete={handleDeleteTodo}
              onStatusChange={handleStatusChange}
              onCreateNew={handleCreateNew}
              onRetry={refetch}
              selectedTodos={selectedTodos}
              onSelectTodo={handleSelectTodo}
            />
          ) : (
            <TodoList
              todos={todos}
              loading={loading}
              error={error}
              onEdit={handleEditTodo}
              onDelete={handleDeleteTodo}
              onStatusChange={handleStatusChange}
              onCreateNew={handleCreateNew}
              onRetry={refetch}
              viewMode={viewMode}
              selectedTodos={selectedTodos}
              onSelectTodo={handleSelectTodo}
            />
          )}
        </div>

        {/* Pagination */}
        {meta && meta.last_page > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={meta.current_page}
              totalPages={meta.last_page}
              onPageChange={handlePageChange}
              loading={loading}
            />
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setEditingTodo(undefined)
        }}
        title={editingTodo ? 'Todo Düzenle' : 'Yeni Todo Oluştur'}
        className="max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        <TodoForm
          todo={editingTodo}
          onSubmit={editingTodo ? handleUpdateTodo : handleCreateTodo}
          onCancel={() => {
            setShowModal(false)
            setEditingTodo(undefined)
          }}
          loading={loading}
        />
      </Modal>

      {/* Toast Notification */}
      <Toast
        type={notification?.type || 'info'}
        message={notification?.message || ''}
        isVisible={!!notification}
        onClose={() => setNotification(null)}
      />

      {/* Chatbot */}
      <Chatbot todos={todos} />
    </div>
  )
}

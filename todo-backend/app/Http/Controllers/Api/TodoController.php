<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Todo;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TodoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Todo::query();

        // Filter by status
        if ($request->has('status')) {
            $statuses = explode(',', $request->get('status'));
            $query->whereIn('status', $statuses);
        }

        // Filter by priority
        if ($request->has('priority')) {
            $priorities = explode(',', $request->get('priority'));
            $query->whereIn('priority', $priorities);
        }

        // Search in title and description
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Sorting
        if ($request->has('sort')) {
            $sort = $request->get('sort');
            $parts = explode(':', $sort);
            $column = $parts[0];
            $direction = $parts[1] ?? 'asc';
            
            if (in_array($column, ['title', 'created_at', 'due_date'])) {
                $query->orderBy($column, $direction);
            }
        } else {
            $query->orderBy('created_at', 'desc');
        }

        // Pagination
        $perPage = $request->get('limit', 12);
        $todos = $query->paginate($perPage);

        // Load tags for each todo
        $todos->getCollection()->load('tags');

        return response()->json($todos);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'required|in:low,medium,high',
            'due_date' => 'nullable|date',
            'tags' => 'nullable|array',
            'tags.*' => 'exists:tags,id',
        ]);

        $todo = Todo::create($request->except('tags'));
        
        if ($request->has('tags') && $request->get('tags')) {
            $tags = is_array($request->get('tags')) ? $request->get('tags') : [];
            if (!empty($tags)) {
                $todo->tags()->attach($tags);
            }
        }

        return response()->json($todo->load('tags'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $todo = Todo::findOrFail($id);
        return response()->json($todo->load('tags'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $todo = Todo::findOrFail($id);

        $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:todo,in_progress,done',
            'priority' => 'sometimes|in:low,medium,high',
            'due_date' => 'nullable|date',
            'tags' => 'nullable|array',
            'tags.*' => 'exists:tags,id',
        ]);

        $todo->update($request->except('tags'));
        
        if ($request->has('tags')) {
            $tags = $request->get('tags');
            if (is_array($tags)) {
                $todo->tags()->sync($tags);
            } else {
                $todo->tags()->sync([]);
            }
        }

        return response()->json($todo->load('tags'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $todo = Todo::findOrFail($id);
        $todo->delete();

        return response()->json(['message' => 'Todo deleted successfully']);
    }

    /**
     * Bulk delete todos
     */
    public function bulkDelete(Request $request): JsonResponse
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:todos,id',
        ]);

        $ids = $request->ids;
        $deletedCount = Todo::whereIn('id', $ids)->delete();

        return response()->json([
            'message' => "{$deletedCount} todo(s) deleted successfully",
            'deleted_count' => $deletedCount
        ]);
    }

    /**
     * Bulk update todo status
     */
    public function bulkUpdateStatus(Request $request): JsonResponse
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:todos,id',
            'status' => 'required|in:todo,in_progress,done',
        ]);

        $updatedCount = Todo::whereIn('id', $request->ids)
            ->update(['status' => $request->status]);

        return response()->json([
            'message' => "{$updatedCount} todo(s) status updated to {$request->status}",
            'updated_count' => $updatedCount
        ]);
    }

    /**
     * Bulk update todo priority
     */
    public function bulkUpdatePriority(Request $request): JsonResponse
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:todos,id',
            'priority' => 'required|in:low,medium,high',
        ]);

        $updatedCount = Todo::whereIn('id', $request->ids)
            ->update(['priority' => $request->priority]);

        return response()->json([
            'message' => "{$updatedCount} todo(s) priority updated to {$request->priority}",
            'updated_count' => $updatedCount
        ]);
    }
}

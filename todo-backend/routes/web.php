<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TodoController;
use App\Http\Controllers\Api\TagController;

Route::get('/', function () {
    return view('welcome');
});

// API Routes
Route::prefix('api')->group(function () {
    Route::apiResource('todos', TodoController::class);
    Route::apiResource('tags', TagController::class);
    Route::get('test-pivot', [TodoController::class, 'testPivot']);
    
    // Bulk operations
    Route::post('todos/bulk-delete', [TodoController::class, 'bulkDelete']);
    Route::post('todos/bulk-update-status', [TodoController::class, 'bulkUpdateStatus']);
    Route::post('todos/bulk-update-priority', [TodoController::class, 'bulkUpdatePriority']);
});

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Todo extends Model
{
    protected $fillable = [
        'title',
        'description',
        'status',
        'priority',
        'due_date',
    ];

    protected $casts = [
        'due_date' => 'date',
    ];

    /**
     * The tags that belong to the todo.
     */
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'todo_tag');
    }
}

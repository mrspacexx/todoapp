<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Tag extends Model
{
    protected $fillable = [
        'name',
        'color',
    ];

    /**
     * The todos that belong to the tag.
     */
    public function todos(): BelongsToMany
    {
        return $this->belongsToMany(Todo::class, 'todo_tag');
    }
}
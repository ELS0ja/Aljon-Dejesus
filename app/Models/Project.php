<?php

namespace App\Models;

use Database\Factories\ProjectFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['title', 'slug', 'category', 'problem', 'description', 'technologies', 'features', 'contribution', 'thumbnail', 'accent', 'github_url', 'demo_url', 'is_placeholder', 'display_order'])]
class Project extends Model
{
    /** @use HasFactory<ProjectFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return ['technologies' => 'array', 'features' => 'array', 'is_placeholder' => 'boolean', 'display_order' => 'integer'];
    }
}

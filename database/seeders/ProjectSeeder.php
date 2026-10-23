<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $projects = json_decode(file_get_contents(database_path('seeders/data/projects.json')), true, flags: JSON_THROW_ON_ERROR);

        foreach ($projects as $project) {
            Project::query()->firstOrCreate(['slug' => $project['slug']], $project);
        }
    }
}

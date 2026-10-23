<?php

namespace Database\Factories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(3),
            'slug' => fake()->unique()->slug(),
            'category' => 'Full-Stack',
            'problem' => fake()->sentence(),
            'description' => fake()->paragraph(),
            'technologies' => ['PHP', 'MySQL'],
            'features' => ['Validated input'],
            'contribution' => '[Replace] Describe your contribution.',
            'thumbnail' => 'dashboard',
            'accent' => 'blue',
            'github_url' => 'https://github.com/your-username/example',
            'demo_url' => null,
            'is_placeholder' => true,
            'display_order' => 0,
        ];
    }
}

<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\Project;
use Database\Seeders\ProjectSeeder;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Tests\TestCase;

class PortfolioControllerTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_seeded_projects_have_the_reference_order_and_counts(): void
    {
        $this->seed(ProjectSeeder::class);

        $this->get(route('portfolio'))->assertOk()->assertViewHas('portfolio', function (array $data): bool {
            $this->assertSame([
                'Student Management System', 'Personal Task Management App', 'Online Portfolio & Project Showcase',
                'Inventory REST API', 'Responsive Landing Page',
            ], array_column($data['projects'], 'title'));
            $this->assertSame(['Full-Stack', 'Full-Stack', 'Full-Stack', 'Backend', 'Frontend'], array_column($data['projects'], 'category'));
            $this->assertSame([true, true, true, true, true], array_column($data['projects'], 'isPlaceholder'));

            return true;
        });
    }

    public function test_reseeding_preserves_edited_projects_and_does_not_duplicate(): void
    {
        $this->seed(ProjectSeeder::class);
        Project::query()->where('slug', 'student-management-system')->update(['title' => 'Edited privately']);

        $this->seed(ProjectSeeder::class);

        $this->assertDatabaseCount('projects', 5);
        $this->assertDatabaseHas('projects', ['title' => 'Edited privately']);
    }

    public function test_database_changes_appear_in_display_order_and_unsafe_urls_are_removed(): void
    {
        Project::factory()->create(['title' => 'Later project', 'display_order' => 2]);
        Project::factory()->create(['title' => 'First project', 'display_order' => 1, 'github_url' => 'javascript:alert(1)']);

        $this->get(route('portfolio'))->assertOk()->assertViewHas('portfolio', function (array $data): bool {
            $this->assertSame(['First project', 'Later project'], array_column($data['projects'], 'title'));
            $this->assertNull($data['projects'][0]['githubUrl']);

            return true;
        });
    }

    public function test_project_content_cannot_break_out_of_the_bootstrap_script(): void
    {
        Project::factory()->create(['title' => '</script><script>alert(1)</script>']);

        $this->get(route('portfolio'))->assertOk()->assertDontSee('</script><script>alert(1)</script>', false);
    }
}

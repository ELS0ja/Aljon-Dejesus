<?php

namespace Tests\Feature\Console;

use Tests\TestCase;

class CheckVercelDeploymentTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        config([
            'app.key' => 'base64:'.base64_encode(str_repeat('a', 32)),
            'app.debug' => false,
            'database.default' => 'pgsql',
            'database.connections.pgsql.url' => null,
            'database.connections.pgsql.host' => 'db.example.test',
        ]);
    }

    public function test_missing_application_key_stops_deployment(): void
    {
        config(['app.key' => '']);

        $this->artisan('vercel:check')->expectsOutputToContain('Set a valid APP_KEY')->assertFailed();
    }

    public function test_invalid_application_key_stops_deployment(): void
    {
        config(['app.key' => 'base64:invalid!']);

        $this->artisan('vercel:check')->expectsOutputToContain('Set a valid APP_KEY')->assertFailed();
    }

    public function test_debug_mode_stops_deployment(): void
    {
        config(['app.debug' => true]);

        $this->artisan('vercel:check')->expectsOutputToContain('APP_DEBUG=false')->assertFailed();
    }

    public function test_ephemeral_sqlite_database_stops_deployment(): void
    {
        config(['database.default' => 'sqlite']);

        $this->artisan('vercel:check')->expectsOutputToContain('configure a hosted database')->assertFailed();
    }

    public function test_localhost_database_stops_deployment(): void
    {
        config(['database.connections.pgsql.host' => '127.0.0.1']);

        $this->artisan('vercel:check')->expectsOutputToContain('local Laragon database')->assertFailed();
    }

    public function test_hosted_database_configuration_passes_without_opening_a_connection(): void
    {
        $this->artisan('vercel:check')->expectsOutputToContain('configuration checks passed')->assertSuccessful();
    }

    public function test_database_url_is_used_instead_of_the_default_localhost(): void
    {
        config([
            'database.connections.pgsql.host' => '127.0.0.1',
            'database.connections.pgsql.url' => 'postgresql://example:example@db.example.test/portfolio?sslmode=require',
        ]);

        $this->artisan('vercel:check')->assertSuccessful();
    }

    public function test_local_database_url_is_rejected_even_with_a_remote_host_setting(): void
    {
        config(['database.connections.pgsql.url' => 'postgresql://example:example@localhost/portfolio']);

        $this->artisan('vercel:check')->expectsOutputToContain('local Laragon database')->assertFailed();
    }
}

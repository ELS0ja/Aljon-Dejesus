<?php

namespace Tests\Feature\Deployment;

use Illuminate\Http\Middleware\TrustProxies;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class VercelProxyTest extends TestCase
{
    private ?string $previousVercelFlag = null;

    protected function setUp(): void
    {
        $this->previousVercelFlag = $_SERVER['VERCEL'] ?? null;
        $_SERVER['VERCEL'] = '1';
        parent::setUp();
    }

    protected function tearDown(): void
    {
        parent::tearDown();
        TrustProxies::flushState();

        if ($this->previousVercelFlag === null) {
            unset($_SERVER['VERCEL']);
        } else {
            $_SERVER['VERCEL'] = $this->previousVercelFlag;
        }
    }

    public function test_vercel_uses_forwarded_https_and_client_ip_but_ignores_forwarded_host(): void
    {
        Route::get('/_proxy-test', fn (Request $request): array => [
            'secure' => $request->isSecure(),
            'ip' => $request->ip(),
            'contactUrl' => route('contact.store'),
        ]);

        $this->withServerVariables(['REMOTE_ADDR' => '10.0.0.1'])
            ->withHeaders([
                'X-Forwarded-For' => '203.0.113.10',
                'X-Forwarded-Proto' => 'https',
                'X-Forwarded-Port' => '443',
                'X-Forwarded-Host' => 'attacker.invalid',
            ])
            ->get('/_proxy-test')
            ->assertOk()
            ->assertExactJson([
                'secure' => true,
                'ip' => '203.0.113.10',
                'contactUrl' => 'https://localhost/contact',
            ]);
    }
}

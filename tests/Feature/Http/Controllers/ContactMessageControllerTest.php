<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Support\Str;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class ContactMessageControllerTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_valid_submission_is_saved_unread_and_returns_201(): void
    {
        $this->freezeTime();
        $payload = $this->payload();

        $this->postJson(route('contact.store'), [...$payload, 'is_read' => true, 'id' => 999])
            ->assertCreated()
            ->assertJsonPath('duplicate', false)
            ->assertJsonPath('message', 'Thanks, Jane! Your message was received and saved.');

        $this->assertDatabaseHas('contact_messages', [
            'name' => 'Jane Doe', 'email' => 'jane@example.com', 'subject' => 'Internship opportunity',
            'message' => $payload['message'], 'is_read' => false, 'submission_id' => $payload['submission_id'],
            'created_at' => now()->toDateTimeString(),
        ]);
        $this->assertDatabaseCount('contact_messages', 1);
    }

    public function test_missing_fields_return_422_with_reference_messages(): void
    {
        $this->postJson(route('contact.store'), [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['name', 'email', 'subject', 'message', 'submission_id'])
            ->assertJsonPath('errors.name.0', 'Please enter your full name.')
            ->assertJsonPath('errors.email.0', 'Please enter your email address.')
            ->assertJsonPath('errors.subject.0', 'Please add a subject.')
            ->assertJsonPath('errors.message.0', 'Please write a message.');

        $this->assertDatabaseCount('contact_messages', 0);
    }

    /** @return array<string, array{string, string, string}> */
    public static function invalidFields(): array
    {
        return [
            'short name' => ['name', 'A', 'Name must be at least 2 characters.'],
            'long name' => ['name', str_repeat('a', 101), 'Name must be 100 characters or fewer.'],
            'invalid email' => ['email', 'not-an-email', 'Please enter a valid email address.'],
            'long email' => ['email', str_repeat('a', 255).'@example.com', 'Email address is too long.'],
            'short subject' => ['subject', 'Hi', 'Subject must be at least 3 characters.'],
            'long subject' => ['subject', str_repeat('a', 151), 'Subject must be 150 characters or fewer.'],
            'short message' => ['message', str_repeat('a', 19), 'Message must be at least 20 characters.'],
            'long message' => ['message', str_repeat('a', 5001), 'Message must be 5,000 characters or fewer.'],
            'spam honeypot' => ['website', 'https://spam.example', 'Your submission could not be processed.'],
        ];
    }

    #[DataProvider('invalidFields')]
    public function test_invalid_fields_return_422_without_saving(string $field, string $value, string $error): void
    {
        $this->postJson(route('contact.store'), [...$this->payload(), $field => $value])
            ->assertUnprocessable()->assertJsonPath("errors.{$field}.0", $error);

        $this->assertDatabaseCount('contact_messages', 0);
    }

    public function test_replayed_submission_returns_200_and_stores_one_message(): void
    {
        $payload = $this->payload();
        $this->postJson(route('contact.store'), $payload)->assertCreated();

        $this->postJson(route('contact.store'), $payload)->assertOk()->assertJsonPath('duplicate', true);

        $this->assertDatabaseCount('contact_messages', 1);
    }

    public function test_reused_submission_id_with_changed_content_returns_409(): void
    {
        $payload = $this->payload();
        $this->postJson(route('contact.store'), $payload)->assertCreated();

        $this->postJson(route('contact.store'), [...$payload, 'subject' => 'Different content'])
            ->assertConflict();

        $this->assertDatabaseCount('contact_messages', 1);
        $this->assertDatabaseHas('contact_messages', ['subject' => 'Internship opportunity']);
    }

    public function test_sender_cooldown_returns_429_until_sixty_seconds_pass(): void
    {
        $this->freezeTime();
        $this->postJson(route('contact.store'), $this->payload())->assertCreated();

        $this->postJson(route('contact.store'), $this->payload())
            ->assertTooManyRequests()->assertHeader('Retry-After', '60');
        $this->assertDatabaseCount('contact_messages', 1);

        $this->travel(61)->seconds();
        $this->postJson(route('contact.store'), $this->payload())->assertCreated();
        $this->assertDatabaseCount('contact_messages', 2);
    }

    public function test_ip_rate_limit_returns_429_after_five_attempts(): void
    {
        $this->freezeTime();
        for ($attempt = 0; $attempt < 5; $attempt++) {
            $this->postJson(route('contact.store'), [])->assertUnprocessable();
        }

        $this->postJson(route('contact.store'), [])->assertTooManyRequests();

        $this->assertDatabaseCount('contact_messages', 0);
    }

    public function test_failed_save_returns_503_without_success_or_a_record(): void
    {
        ContactMessage::creating(function (): void {
            throw new QueryException('sqlite', 'insert into contact_messages', [], new \PDOException('Simulated storage failure'));
        });

        $this->postJson(route('contact.store'), $this->payload())
            ->assertServiceUnavailable()
            ->assertJsonPath('message', 'Something went wrong saving your message. Please try again or email me directly.')
            ->assertJsonMissingPath('duplicate');

        $this->assertDatabaseCount('contact_messages', 0);
    }

    public function test_html_validation_failure_preserves_input_in_the_session(): void
    {
        $payload = [...$this->payload(), 'email' => 'invalid'];

        $this->from('/')->post(route('contact.store'), $payload)
            ->assertRedirect('/')->assertSessionHasErrors('email')
            ->assertSessionHasInput('name', 'Jane Doe')
            ->assertSessionHasInput('message', $payload['message']);

        $this->assertDatabaseCount('contact_messages', 0);
    }

    /** @return array<string, string> */
    private function payload(): array
    {
        return [
            'name' => 'Jane Doe', 'email' => 'jane@example.com', 'subject' => 'Internship opportunity',
            'message' => 'I would like to discuss an internship opportunity with you.',
            'website' => '', 'submission_id' => (string) Str::uuid(),
        ];
    }
}

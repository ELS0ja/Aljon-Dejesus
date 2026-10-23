<?php

namespace Database\Factories;

use App\Models\ContactMessage;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ContactMessage>
 */
class ContactMessageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'subject' => 'Internship opportunity',
            'message' => 'I would like to discuss an internship opportunity with you.',
            'submission_id' => fake()->uuid(),
            'payload_hash' => hash('sha256', fake()->uuid()),
        ];
    }
}

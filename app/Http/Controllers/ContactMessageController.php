<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactMessageRequest;
use App\Models\ContactMessage;
use Illuminate\Contracts\Cache\LockTimeoutException;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\RateLimiter;

class ContactMessageController extends Controller
{
    public function store(StoreContactMessageRequest $request): JsonResponse
    {
        $data = $request->safe()->only(['name', 'email', 'subject', 'message']);
        $hash = hash('sha256', json_encode($data, JSON_THROW_ON_ERROR));
        $senderKey = 'contact-sender:'.hash('sha256', mb_strtolower($data['email']).'|'.$request->ip());

        try {
            return Cache::lock($senderKey.':lock', 15)->block(3, function () use ($request, $data, $hash, $senderKey): JsonResponse {
                $existing = ContactMessage::query()->where('submission_id', $request->validated('submission_id'))->first();

                if ($existing) {
                    return $this->receipt($existing, $hash, true);
                }

                if (RateLimiter::tooManyAttempts($senderKey, 1)) {
                    $seconds = RateLimiter::availableIn($senderKey);

                    return response()->json(['message' => "You've just sent a message. Please wait {$seconds} seconds before sending another."], 429)
                        ->header('Retry-After', (string) $seconds);
                }

                $message = ContactMessage::query()->firstOrCreate(
                    ['submission_id' => $request->validated('submission_id')],
                    [...$data, 'payload_hash' => $hash],
                );

                if ($message->wasRecentlyCreated) {
                    RateLimiter::hit($senderKey, 60);
                }

                return $this->receipt($message, $hash, ! $message->wasRecentlyCreated);
            });
        } catch (QueryException $exception) {
            report($exception);

            return response()->json(['message' => 'Something went wrong saving your message. Please try again or email me directly.'], 503);
        } catch (LockTimeoutException) {
            return response()->json(['message' => 'Your message is still being processed. Please try again in a moment.'], 409);
        }
    }

    private function receipt(ContactMessage $message, string $hash, bool $duplicate): JsonResponse
    {
        if (! hash_equals($message->payload_hash, $hash)) {
            return response()->json(['message' => 'This submission has already been used. Please reload the page before sending a different message.'], 409);
        }

        $firstName = explode(' ', $message->name)[0];

        return response()->json([
            'message' => "Thanks, {$firstName}! Your message was received and saved.",
            'duplicate' => $duplicate,
        ], $duplicate ? 200 : 201);
    }
}

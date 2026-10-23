<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreContactMessageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['bail', 'required', 'string', 'min:2', 'max:100'],
            'email' => ['bail', 'required', 'string', 'max:254', 'email:rfc'],
            'subject' => ['bail', 'required', 'string', 'min:3', 'max:150'],
            'message' => ['bail', 'required', 'string', 'min:20', 'max:5000'],
            'website' => ['prohibited'],
            'submission_id' => ['required', 'uuid'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'name.required' => 'Please enter your full name.',
            'name.min' => 'Name must be at least 2 characters.',
            'name.max' => 'Name must be 100 characters or fewer.',
            'email.required' => 'Please enter your email address.',
            'email.email' => 'Please enter a valid email address.',
            'email.max' => 'Email address is too long.',
            'subject.required' => 'Please add a subject.',
            'subject.min' => 'Subject must be at least 3 characters.',
            'subject.max' => 'Subject must be 150 characters or fewer.',
            'message.required' => 'Please write a message.',
            'message.min' => 'Message must be at least 20 characters.',
            'message.max' => 'Message must be 5,000 characters or fewer.',
            'website.prohibited' => 'Your submission could not be processed.',
        ];
    }
}

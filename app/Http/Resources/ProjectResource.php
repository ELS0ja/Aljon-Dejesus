<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'category' => $this->category,
            'problem' => $this->problem,
            'description' => $this->description,
            'technologies' => $this->technologies,
            'features' => $this->features,
            'contribution' => $this->contribution,
            'thumbnail' => $this->thumbnail,
            'accent' => $this->accent,
            'githubUrl' => $this->safeUrl($this->github_url),
            'demoUrl' => $this->safeUrl($this->demo_url),
            'isPlaceholder' => $this->is_placeholder,
        ];
    }

    private function safeUrl(?string $url): ?string
    {
        return $url && filter_var($url, FILTER_VALIDATE_URL)
            && in_array(parse_url($url, PHP_URL_SCHEME), ['http', 'https'], true)
                ? $url : null;
    }
}

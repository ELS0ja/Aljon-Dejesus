<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class CvController extends Controller
{
    public function __invoke(): StreamedResponse|JsonResponse
    {
        if (! Storage::disk('local')->exists('cv.pdf')) {
            return response()->json(['message' => 'The CV is not configured yet. Please contact me directly for a copy.'], 404);
        }

        return Storage::disk('local')->download('cv.pdf', 'CV.pdf', ['Content-Type' => 'application/pdf']);
    }
}

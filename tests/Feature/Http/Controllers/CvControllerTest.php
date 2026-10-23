<?php

namespace Tests\Feature\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class CvControllerTest extends TestCase
{
    public function test_missing_cv_returns_404_with_honest_feedback(): void
    {
        Storage::fake('local');

        $this->getJson(route('cv.download'))->assertNotFound()
            ->assertJsonPath('message', 'The CV is not configured yet. Please contact me directly for a copy.');
    }

    public function test_configured_pdf_is_downloaded(): void
    {
        Storage::fake('local');
        Storage::disk('local')->put('cv.pdf', "%PDF-1.4\nTest resume");

        $this->get(route('cv.download'))->assertOk()->assertDownload('CV.pdf')
            ->assertHeader('Content-Type', 'application/pdf');
    }
}

<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProjectResource;
use App\Models\Project;
use Illuminate\Contracts\View\View;

class PortfolioController extends Controller
{
    public function index(): View
    {
        return view('portfolio', [
            'portfolio' => [
                'projects' => ProjectResource::collection(Project::query()->orderBy('display_order')->orderBy('id')->get())->resolve(),
                'contactUrl' => route('contact.store'),
                'cvUrl' => route('cv.download'),
            ],
        ]);
    }
}

<?php

use App\Http\Controllers\ContactMessageController;
use App\Http\Controllers\CvController;
use App\Http\Controllers\PortfolioController;
use Illuminate\Support\Facades\Route;

Route::get('/', [PortfolioController::class, 'index'])->name('portfolio');
Route::post('/contact', [ContactMessageController::class, 'store'])->middleware('throttle:contact')->name('contact.store');
Route::get('/cv', CvController::class)->name('cv.download');

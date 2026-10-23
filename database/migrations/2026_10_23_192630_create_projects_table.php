<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('category', 30);
            $table->text('problem');
            $table->text('description');
            $table->json('technologies');
            $table->json('features');
            $table->text('contribution');
            $table->string('thumbnail');
            $table->string('accent', 30)->default('blue');
            $table->string('github_url', 2048);
            $table->string('demo_url', 2048)->nullable();
            $table->boolean('is_placeholder')->default(true);
            $table->unsignedInteger('display_order')->default(0)->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
